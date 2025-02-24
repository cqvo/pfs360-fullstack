import db from '$lib/server/database';
import { dimClients, dimItems, dimAccounts } from '$lib/server/database/schema';
import { sql, eq, lt, gte, ne } from 'drizzle-orm';
import logger from '$lib/logger';

interface ClientRecord {
    taxdomeId: string;
    companyName: string;
    emailAddress: string;
}

const clientModel = {
    upsertClient: async (record: ClientRecord) => {
        try {
            const result = await db.insert(dimClients)
                .values(record)
                .onConflictDoUpdate({
                    target: [dimClients.taxdomeId],
                    set: {
                        companyName: record.companyName,
                        emailAddress: record.emailAddress,
                    },
                });
            if (!result) {
                throw new Error(`No rows returned from upsertClient: ${record.taxdomeId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error upserting client:', error);
            throw new Error(`Failed to upsert client: ${error instanceof Error ? error.message : String(error)}`);
        }
        },
    upsertClients: async (records: Array<ClientRecord>) => {
        try {
            const results = [];
            for (const record of records) {
                const result = await clientModel.upsertClient(record);
                results.push(result);
            }
            return results;
        } catch (error) {
            logger.error('Error upserting clients:', error);
            throw new Error(`Failed to upsert clients: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveClients: async () => {
        try {
            const result = await db.query.dimClients.findMany();
            if (!result) {
                throw new Error('No rows returned from retrieveClients');
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving clients:', error);
            throw new Error(`Failed to retrieve clients: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveClientById: async (clientId: number) => {
        try {
            const result = await db.query.dimClients.findFirst({
                where: eq(dimClients.id, clientId),
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
    retrieveItems: async () => {
        try {
            const result = await db.query.dimClients.findMany({
                with: { dimItems: true },
            });
            if (!result) {
                throw new Error('No rows returned from retrieveItems');
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving items:', error);
            throw new Error(`Failed to retrieve items: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveItemsByClientId: async (clientId: number) => {
        try {
            const result = await db.query.dimItems.findMany({
                where: eq(dimItems.clientId, clientId),
                with: { 
                    dimInstitutions: true,
                    dimAccounts: true,
                },
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveItemsByClientId: ${clientId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving items by client ID:', error);
            throw new Error(`Failed to retrieve items by client ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveAccounts: async () => {
        try {
            const result = await db.query.dimClients.findMany({
                with: {
                    dimItems: {
                        with: { dimAccounts: true },
                    }
                },
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveAccounts`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving accounts:', error);
            throw new Error(`Failed to retrieve accounts: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveAccountByAccountId: async (accountId: number) => {
        try {
            const result = await db.query.dimAccounts.findFirst({
                where: eq(dimAccounts.id, accountId),
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveAccountByAccountId: ${accountId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving account by ID:', error);
            throw new Error(`Failed to retrieve account by ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
}

export default clientModel;