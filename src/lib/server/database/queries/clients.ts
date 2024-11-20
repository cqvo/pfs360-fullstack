import { db } from '$lib/server/database';
import { dimAccounts, dimClients, dimItems, dimInstitutions } from '$lib/server/database/schema';
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
export const retrieveClients = async (): Promise<object> => {
    const clients = await db.select().from(dimClients);
    return clients;
};

/**
 * Retrieves all clients and their items.
 *
 * @returns {object} a user.
 */
export const retrieveClientsItems = async (): Promise<object> => {
    const result = await db.select().from(dimClients)
    .leftJoin(dimItems, eq(dimClients.id, dimItems.clientId))
    .leftJoin(dimAccounts, eq(dimItems.id, dimAccounts.itemId))
    .leftJoin(dimInstitutions, eq(dimItems.institutionId, dimInstitutions.id));
    return result;
};

/**
 * Retrieves a client by id.
 *
 * @param {number} id - the client id.
 * @returns {object} a client.
 */
export const retrieveClientById = async (id: number): Promise<object> => {
    const client = await db.select().from(dimClients)
    .where(eq(dimClients.id, id));
    return client;
}

/**
 * Retrieves a client by id and their items.
 *
 * @param {number} id - the client id.
 * @returns {object} a client.
 */
export const retrieveClientItemsById = async (id: number): Promise<object> => {
    const result = await db.select().from(dimClients)
        .leftJoin(dimItems, eq(dimClients.id, dimItems.clientId))
        .leftJoin(dimAccounts, eq(dimItems.id, dimAccounts.itemId))
        .leftJoin(dimInstitutions, eq(dimItems.institutionId, dimInstitutions.id))
        .where(eq(dimClients.id, id));
    const client = result[0];
    return client;
}