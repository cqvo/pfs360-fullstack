import db from '$lib/server/database';
import { dimInstitutions, dimItems, factLinkRequests } from '$lib/server/database/schema';
import { sql, eq, lt, gte, ne } from 'drizzle-orm';
import { encrypt, decrypt } from '$lib/server/crypto';

const linkModel = {
    insertLinkRequest: async (linkRequest) => {
        try {
            const link = await db
                .insert(factLinkRequests)
                .values(linkRequest)
                .returning();
            return link;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
        
    },
    upsertInstitution: async (institution) => {
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
            const encrypted = await encrypt(item['access_token']);
            await db
                .insert(dimItems)
                .values({
                    plaidItemId: item.plaidItemId,
                    clientId: item.clientId,
                    institutionId: item.institutionId,
                    status: 'Active',
                    accessToken: encrypted.ciphertext,
                    keyDate: encrypted.keyDate,
                    keyIv: encrypted.ivHexString,
                })
                .onConflictDoUpdate({ target: dimItems.plaidItemId, set: {
                    status: 'Active',
                    accessToken: encrypted.ciphertext,
                    keyDate: encrypted.keyDate,
                    keyIv: encrypted.ivHexString,
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