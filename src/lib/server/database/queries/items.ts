import db from '$lib/server/database';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { dimInstitutions, dimItems, dimClients } from '$lib/server/database/schema';


/**
 * Updates the status for a single item.
 *
 * @param {string} itemId the Plaid item ID of the item.
 * @param {number} status the status of the item.
 */
export const updateItemStatus = async (itemId: string, status: string): Promise<void> => {
  const items = await db.update(dimItems)
    .set({ status: status })
    .where(eq(dimItems.id, itemId));
}


/**
 * Retrieves a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @returns {Object} an item.
 */
export const retrieveItemByPlaidItemId = async (plaidItemId: string) => {
  const items = await db.select().from(dimItems).where(eq(dimItems.plaidItemId, plaidItemId));
  return items[0];
}

export const retrieveItemsByClientId = async (clientId: number) => {
  const items = await db.query.dimItems.findMany({
      where: (dimItems, { eq }) => (eq(dimItems.id, clientId)),
      // with: {
      //   dimInstitutions: true
      // },
  });
  return items;
}

// interface ItemWithAccounts {
//   id: number;
//   plaidItemId: string;
//   accessToken: string | null;
//   createdAt: string;
//   updatedAt: string;
//   clientId: number;
//   institutionId: number;
//   status: string;
//   accounts?: any[];
// }

export const retrieveItemsAccountsByClientId = async (clientId: number) => {
  const items = await db.query.dimItems.findMany({
      where: (dimItems, { eq }) => eq(dimItems.clientId, clientId),
      with: { dimInstitutions: true, dimAccounts: true, dimClients: true },
  });
  return items;
} 