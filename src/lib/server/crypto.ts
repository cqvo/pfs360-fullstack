import type { Cipher, CipherKey } from 'node:crypto';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const algorithm: string = 'aes-256-cbc';

const findOrCreateKey = async (yyyyMM: string) => {
	// @ts-ignore
	const kv = await Deno.openKv();
	const result = await kv.get(['encryptionKeys', yyyyMM]);
	if (!result.value) {
		const key: CipherKey = randomBytes(32);
		// @ts-ignore
		await kv.set(['encryptionKeys', yyyyMM], key.toString('hex'));
		return key as Buffer;
	} else {
		const result = await kv.get(['encryptionKeys', yyyyMM]);
		return Buffer.from(result.value as string, 'hex');
	}
};

export const encrypt = async (plaintext: string) => {
	// Get year and month in yyyyMM format
	const today = new Date();
	const year: number = today.getFullYear();
	const month: string = String(today.getMonth() + 1).padStart(2, '0');
	const yyyyMM: string = `${year}${month}`;
	// Find or create encryption key 'mmmmYY'
	const key: Buffer = await findOrCreateKey(yyyyMM);
	const iv: Buffer = randomBytes(16);
	// Use key and IV to create cipher, then encrypt plaintext
	const cipher: Cipher = createCipheriv(algorithm, key, iv);
	let encrypted: string = cipher.update(plaintext, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	// Return encrypted string and IV as array
	return { ciphertext: encrypted, keyDate: yyyyMM, ivHexString: iv.toString('hex') };
};

export const decrypt = async (ciphertext: string, keyDate: string, ivHexString: string) => {
	const key: Buffer = await findOrCreateKey(keyDate);
	const iv: Buffer = Buffer.from(ivHexString, 'hex');
	const decipher = createDecipheriv(algorithm, key, iv);
	let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
	plaintext += decipher.final('utf8');
	return plaintext as string;
};
