import db from '$lib/server/database';
import { dimInstitutions, dimItems, factLinkRequests, dimClients } from '$lib/server/database/schema';
import { sql, eq, lt, gte, ne } from 'drizzle-orm';
import { encrypt, decrypt } from '$lib/server/crypto';
import logger from '$lib/logger';

interface InstitutionUpsertRequest {
    plaidInstitutionId: string;
    name: string;
}
interface NewLinkInsertionRequest {
    linkToken: string;
    requestId: string;
    clientId: number;
    expiration: Date;
}
interface ItemUpsertRequest {
    plaidItemId: string;
    clientId: number;
    institutionId: number;
    accessToken: string;
    status: string;
}

const linkModel = {
    retrieveClientById: async (clientId: number) => {
        try {
            await db
                .update(factLinkRequests)
                .set({
                    status: 'Expired',
                    updatedAt: (new Date()).toISOString(),
                })
                .where( lt(factLinkRequests.expiration, (new Date()).toISOString()) );
            const result = await db.query.dimClients.findFirst({
                where: eq(dimClients.id, clientId),
                with: {
                    factLinkRequests: {
                        where: (factLinkRequests, { eq }) => eq(factLinkRequests.status, 'Pending'),
                    },
                    dimLinks: true,
                },
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveClientById: ${clientId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving client by ID:', error);
            throw new Error(`Failed to retrieve client by ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveMostRecentLinkRequest: async (clientId: number) => {
        try {
            const result = await db.query.factLinkRequests.findFirst({
                where: eq(factLinkRequests.clientId, clientId),
                orderBy: (factLinkRequests, { desc }) => [desc(factLinkRequests.createdAt)],
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveMostRecentLinkRequest: ${clientId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving most recent link request:', error);
            throw new Error(`Failed to retrieve most recent link request: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    insertNewLinkRequest: async (linkRequest: NewLinkInsertionRequest) => {
        try {
            const result = await db
                .insert(factLinkRequests)
                .values({
                    ...linkRequest,
                    expiration: linkRequest.expiration.toISOString(),
                })
                .returning();
            if (!result) {
                throw new Error('No rows returned from insertNewLinkRequest');
            }
            return result[0];
        } catch (error) {
            logger.error('Error inserting new link request:', error);
            throw new Error(`Failed to insert new link request: ${error instanceof Error ? error.message : String(error)}`);
        }
        
    },
    upsertInstitution: async (institution: InstitutionUpsertRequest) => {
        try {
            const result = await db
                .insert(dimInstitutions)
                .values({
                    plaidInstitutionId: institution.plaidInstitutionId,
                    name: institution.name,
                })
                .onConflictDoUpdate({ target: dimInstitutions.plaidInstitutionId, set: { name: institution.name }})
                .returning();
            return result[0];
            if (!result) {
                throw new Error(`No rows returned from upsertInstitution: ${institution.plaidInstitutionId}`);
            }
        } catch (error) {
            logger.error(error);
            throw new Error(`Failed to upsert institution: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    upsertItem: async (item: ItemUpsertRequest) => {
        try {
            const [encrypted, iv] = await encrypt(item.accessToken);
            if (!encrypted || !iv) {
                throw new Error('No ciphertext or IV returned from encrypt');
            }
            const result = await db
                .insert(dimItems)
                .values({
                    plaidItemId: item.plaidItemId,
                    accessToken: encrypted,
                    accessTokenIv: iv,
                    clientId: item.clientId,
                    institutionId: item.institutionId,
                    status: 'Active',
                })
                .onConflictDoUpdate({ target: dimItems.plaidItemId, set: {
                    status: 'Active',
                    accessToken: encrypted,
                    accessTokenIv: iv,
                }})
                .returning();
            if (!result) {
                throw new Error(`No rows returned from upsertItem: ${item.plaidItemId}`);
            }
            return result;
        } catch (error) {
            logger.error(error);
            throw new Error(`Failed to upsert item: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    updateLinkRequest: async (linkToken: string) => {
        try {
            const result = await db
                .update(factLinkRequests)
                .set({
                    status: 'Completed',
                    completedAt: (new Date()).toISOString(),
                    updatedAt: (new Date()).toISOString(),
                })
                .where(eq(factLinkRequests.linkToken, linkToken))
                .returning();
            if (!result) {
                throw new Error(`No rows returned from updateLinkRequest: ${linkToken}`);
            }
            return result[0];
        } catch (error) {
            logger.error(error);
            throw new Error(`Failed to update link request: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
};

export default linkModel;