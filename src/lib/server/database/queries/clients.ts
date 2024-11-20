import { db } from '$lib/server/database';
import { dimClients, dimItems } from '$lib/server/database/schema';
import { eq, lt, gte, ne } from 'drizzle-orm';

/**
 * Interface for a client object, not originating from the database.
 * 
 * @interface Client
 */
interface Client {
    id: number;
    taxdomeId: string;
    companyName: string;
    emailAddress: string;
}

/**
 * Inserts or updates a client.
 * 
 * @param client 
 */
export const upsertClient = async (client: Client) => {
    await db.insert(dimClients)
    .values(client)
    .onConflictDoUpdate({ target: dimClients.taxdomeId, set: client });
};

/**
 * Retrieves all users.
 *
 * @returns {object} a user.
 */
export const retrieveClients = async () => {
    const clients = await db.select().from(dimClients);
    return clients;
};

/**
 * Retrieves all clients and their items.
 *
 * @returns {object} a user.
 */
export const retrieveClientsItems = async () => {
    const result = await db.select().from(dimClients)
    .leftJoin(dimItems, eq(dimClients.id, dimItems.clientId));
    return result;
};