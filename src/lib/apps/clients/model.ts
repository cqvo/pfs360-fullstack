import db from '$lib/server/database';
import { dimClients, dimItems } from '$lib/server/database/schema';
import { sql, eq, lt, gte, ne } from 'drizzle-orm';
import logger from '$lib/logger';

const clientModel = {
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
            const result = await db.query.dimItems.findMany();
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
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveItemsByClientId: ${clientId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving items by client ID:', error);
            throw new Error(`Failed to retrieve items by client ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

export default clientModel;