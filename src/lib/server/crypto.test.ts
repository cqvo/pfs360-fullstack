import { describe, it, beforeAll, expect } from 'vitest';
import { encrypt, decrypt } from './crypto';

describe('Crypto Module', () => {
    const plaintext = 'Hello, World!';
    let result;
    let encrypted: string;
    let ivHexString: string;

    beforeAll(async () => {
        result = await encrypt(plaintext);
        console.log('encrypted', result);
        encrypted = result.encrypted;
        ivHexString = result.ivHexString;
    });

    it('encrypt should return an object with encrypted text and IV', () => {
        expect(typeof result).toBe('object');
        expect(typeof encrypted).toBe('string');
        expect(typeof ivHexString).toBe('string');
    });

    it('decrypt should return the original plaintext', async () => {
        const decrypted = await decrypt(encrypted, ivHexString);
        expect(decrypted).toBe(plaintext);
    });
});
