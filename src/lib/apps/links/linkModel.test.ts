import { describe, it, expect, vi } from 'vitest';
import linkModel from './linkModel';
import db from '$lib/server/database';
import { encrypt } from '$lib/server/crypto';
import logger from '$lib/logger';

vi.mock('$lib/server/database');
vi.mock('$lib/server/crypto');
vi.mock('$lib/logger');

describe('linkModel', () => {
    describe('retrieveClientById', () => {
        it('should retrieve client by ID', async () => {
            const mockClient = { id: 1, name: 'Test Client' };
            db.query.dimClients.findFirst.mockResolvedValue(mockClient);

            const result = await linkModel.retrieveClientById(1);
            expect(result).toEqual(mockClient);
        });

        it('should throw an error if no client is found', async () => {
            db.query.dimClients.findFirst.mockResolvedValue(null);

            await expect(linkModel.retrieveClientById(1)).rejects.toThrow('No rows returned from retrieveClientById: 1');
        });
    });

    describe('insertNewLinkRequest', () => {
        it('should insert a new link request', async () => {
            const mockRequest = { linkToken: 'token', requestId: 'req', clientId: 1, expiration: new Date() };
            const mockResult = [mockRequest];
            db.insert.mockReturnValue({
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(mockResult),
            });

            const result = await linkModel.insertNewLinkRequest(mockRequest);
            expect(result).toEqual(mockResult);
        });

        it('should throw an error if insertion fails', async () => {
            const mockRequest = { linkToken: 'token', requestId: 'req', clientId: 1, expiration: new Date() };
            db.insert.mockReturnValue({
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(null),
            });

            await expect(linkModel.insertNewLinkRequest(mockRequest)).rejects.toThrow('No rows returned from insertNewLinkRequest');
        });
    });

    describe('upsertInstitution', () => {
        it('should upsert an institution', async () => {
            const mockInstitution = { plaidInstitutionId: 'inst1', name: 'Institution 1' };
            const mockResult = [mockInstitution];
            db.insert.mockReturnValue({
                values: vi.fn().mockReturnThis(),
                onConflictDoUpdate: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(mockResult),
            });

            await expect(linkModel.upsertInstitution(mockInstitution)).resolves.not.toThrow();
        });

        it('should throw an error if upsert fails', async () => {
            const mockInstitution = { plaidInstitutionId: 'inst1', name: 'Institution 1' };
            db.insert.mockReturnValue({
                values: vi.fn().mockReturnThis(),
                onConflictDoUpdate: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(null),
            });

            await expect(linkModel.upsertInstitution(mockInstitution)).rejects.toThrow('No rows returned from upsertInstitution: inst1');
        });
    });

    describe('upsertItem', () => {
        it('should upsert an item', async () => {
            const mockItem = { plaidItemId: 'item1', clientId: 1, institutionId: 1, accessToken: 'token', status: 'Active' };
            const mockEncrypted = ['encryptedToken', 'iv'];
            const mockResult = [mockItem];
            encrypt.mockResolvedValue(mockEncrypted);
            db.insert.mockReturnValue({
                values: vi.fn().mockReturnThis(),
                onConflictDoUpdate: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(mockResult),
            });

            const result = await linkModel.upsertItem(mockItem);
            expect(result).toEqual(mockResult);
        });

        it('should throw an error if encryption fails', async () => {
            const mockItem = { plaidItemId: 'item1', clientId: 1, institutionId: 1, accessToken: 'token', status: 'Active' };
            encrypt.mockResolvedValue([null, null]);

            await expect(linkModel.upsertItem(mockItem)).rejects.toThrow('No ciphertext or IV returned from encrypt');
        });

        it('should throw an error if upsert fails', async () => {
            const mockItem = { plaidItemId: 'item1', clientId: 1, institutionId: 1, accessToken: 'token', status: 'Active' };
            const mockEncrypted = ['encryptedToken', 'iv'];
            encrypt.mockResolvedValue(mockEncrypted);
            db.insert.mockReturnValue({
                values: vi.fn().mockReturnThis(),
                onConflictDoUpdate: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(null),
            });

            await expect(linkModel.upsertItem(mockItem)).rejects.toThrow('No rows returned from upsertItem: item1');
        });
    });

    describe('updateLinkRequest', () => {
        it('should update a link request', async () => {
            const mockLinkToken = 'token';
            const mockResult = [{ linkToken: mockLinkToken, status: 'Completed', updatedAt: new Date().toISOString() }];
            db.update.mockReturnValue({
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(mockResult),
            });

            const result = await linkModel.updateLinkRequest(mockLinkToken);
            expect(result).toEqual(mockResult[0]);
        });

        it('should throw an error if update fails', async () => {
            const mockLinkToken = 'token';
            db.update.mockReturnValue({
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(null),
            });

            await expect(linkModel.updateLinkRequest(mockLinkToken)).rejects.toThrow('No rows returned from updateLinkRequest: token');
        });
    });
});