import type { Cipher, CipherKey } from 'node:crypto';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { ENCRYPTION_KEY } from '$env/static/private';

const algorithm: string = 'aes-256-cbc';
const key: CipherKey = Buffer.from(ENCRYPTION_KEY, 'hex');

export const encrypt = (plaintext: string) => {
	// Use key and random IV to create cipher, then encrypt plaintext
	const iv: Buffer = randomBytes(16);
	const cipher: Cipher = createCipheriv(algorithm, key, iv);
	let encrypted: string = cipher.update(plaintext, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	// Return encrypted string and IV as object
	const ivHexString = iv.toString('hex');
	return { encrypted, ivHexString };
};

export const decrypt = (ciphertext: string, ivHexString: string) => {
	// const key: Buffer = await findOrCreateKey(keyDate);
	const iv: Buffer = Buffer.from(ivHexString, 'hex');
	const decipher = createDecipheriv(algorithm, key, iv);
	let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
	plaintext += decipher.final('utf8');
	return plaintext as string;
};
