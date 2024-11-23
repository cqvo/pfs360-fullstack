// import db from '$lib/server/database';
// import { dimClients, dimItems } from '$lib/server/database/schema';
// import { sql, eq, lt, gte, ne } from 'drizzle-orm';

// /**
//  * Interface for a client object, not originating from the database.
//  * 
//  * @interface Client
//  */
// interface Client {
//     id: number;
//     taxdomeId: string;
//     companyName: string;
//     emailAddress: string;
// }

// /**
//  * Inserts or updates a client.
//  * 
//  * @param client 
//  */
// export const upsertClient = async (client: Record<string, string>) => {
// 	await db
// 		.insert(dimClients)
// 		.values(client)
// 		.onConflictDoUpdate({ target: dimClients.taxdomeId, set: client });
// };

// /**
//  * Retrieves all users.
//  *
//  * @returns {object} a user.
//  */
// export const retrieveClients = async (): Promise<object> => {
//     const clients = await db.select().from(dimClients);
//     return clients;
// };

// export const retrieveClientById = async (clientId: number) => {
//     const clients = await db.select().from(dimClients)
//         .where(eq(dimClients.id, clientId));
//     return clients[0];
// };

// /**
//  * Retrieves all clients and their items.
//  *
//  * @returns {object} a user.
//  */
// // export const retrieveClientsItems = async () => {
// //     const result = await db.select().from(dimClients)
// //     .leftJoin(dimItems, eq(dimClients.id, dimItems.clientId));
// //     return result;
// // };

// export const retrieveClientsItems = async () => {
//     const result = await db.query.dimClients.findMany({
//         with: {
//             dimItems: true
//         }
//     });
//     return result;
// }

// export const retrieveClientItemsById = async (clientId: number) => {
//     const result = await db.query.dimClients.findMany({
//         where: (dimClients, { eq }) => eq(dimClients.id, clientId),
//         with: {
//             dimItems: {
//                 with: {
//                     dimAccounts: true
//                 },
//             },
//         }
//     });
//     return result[0];
// }

// export const retrieveClientAccountsById = async (clientId: number) => {
//     const result = await db.execute(sql`
//         SELECT a.id        AS id,
//         c.company_name as company,
//         a.name      AS name,
//         a.type      AS type,
//         a.subtype   AS subtype,
//         n.name      AS institution,
//         i.status    AS status
//         FROM dim_accounts a
//         LEFT JOIN dim_items i ON a.item_id = i.id
//         LEFT JOIN dim_institutions n ON i.institution_id = n.id
//         LEFT JOIN dim_clients c ON i.client_id = c.id
//         WHERE i.client_id = ${clientId};
//         `);
//     return result.rows;
// }