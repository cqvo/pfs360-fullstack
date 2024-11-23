import db from '$lib/server/database';
import { dimInstitutions, dimItems, factLinkRequests, dimClients } from '$lib/server/database/schema';
import { sql, eq, lt, gte, ne } from 'drizzle-orm';
import { encrypt, decrypt } from '$lib/server/crypto';

interface InstitutionUpsert {
    plaidInstitutionId: string;
    name: string;
}
interface NewLinkInsertion {
    linkToken: string;
    requestId: string;
    clientId: number;
    expiration: Date;
}

const linkModel = {
    retrieveClientById: async (clientId: number) => {
        try {
            const client = await db.query.dimClients.findFirst({
                where: eq(dimClients.id, clientId),
            });
            if (!client) {
                throw new Error(`Client with id ${clientId} not found`);
            }
            return client;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    },
    insertNewLinkRequest: async (linkRequest: NewLinkInsertion) => {
        try {
            const link = await db
                .insert(factLinkRequests)
                .values({
                    ...linkRequest,
                    expiration: linkRequest.expiration.toISOString(),
                })
                .returning();
            return link;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
        
    },
    upsertInstitution: async (institution: InstitutionUpsert) => {
        try {
            await db
                .insert(dimInstitutions)
                .values({
                    plaidInstitutionId: institution['institution_id'],
                    name: institution['name'],
                })
                .onConflictDoUpdate({ target: dimInstitutions.plaidInstitutionId, set: { name: institution['name'] }});
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    },
    upsertItem: async (item) => {
        try {
            const [encrypted, iv] = await encrypt(item['access_token']);
            await db
                .insert(dimItems)
                .values({
                    plaidItemId: item.plaidItemId,
                    clientId: item.clientId,
                    institutionId: item.institutionId,
                    status: 'Active',
                    accessToken: encrypted,
                    keyIv: iv,
                })
                .onConflictDoUpdate({ target: dimItems.plaidItemId, set: {
                    status: 'Active',
                    accessToken: encrypted,
                    keyIv: iv,
                }});
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    },
    updateLinkRequest: async (linkToken: string) => {
        try {
            const link = await db
                .update(factLinkRequests)
                .set({
                    status: 'Completed',
                    updatedAt: (new Date()).toISOString(),
                })
                .where(eq(factLinkRequests.linkToken, linkToken))
                .returning();
            return link[0];
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    },
};

export default linkModel;