import { describe, it, beforeAll, expect } from 'vitest';
import { encrypt, decrypt } from './crypto';

describe('Crypto Module', () => {
    const plaintext = 'Hello, World!';
    let encrypted: string[];
    let ivHexString: string;

    beforeAll(async () => {
        encrypted = await encrypt(plaintext);
        ivHexString = encrypted[1];
    });

    it('encrypt should return an array with encrypted text and IV', () => {
        expect(encrypted).toHaveLength(2);
        expect(typeof encrypted[0]).toBe('string');
        expect(typeof encrypted[1]).toBe('string');
    });

    it('decrypt should return the original plaintext', async () => {
        const decrypted = await decrypt(encrypted[0], ivHexString);
        expect(decrypted).toBe(plaintext);
    });
});
