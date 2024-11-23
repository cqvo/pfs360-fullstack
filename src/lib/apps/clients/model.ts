import db from '$lib/server/database';
import { dimClients } from '$lib/server/database/schema';
import { sql, eq, lt, gte, ne } from 'drizzle-orm';

const clientModel = {
    retrieveClientById: async (clientId: number) => {
        try {
            const client = await db.query.dimClients.findFirst({
                where: eq(dimClients.id, clientId),
            });
            return client;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
}

export default clientModel;