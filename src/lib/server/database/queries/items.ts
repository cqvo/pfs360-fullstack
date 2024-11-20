import { db } from '$lib/server/database';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { dimAccounts, dimItems } from '$lib/server/database/schema';


/**
 * Updates the status for a single item.
 *
 * @param {string} plaidItemId the Plaid item ID of the item.
 * @param {number} status the status of the item.
 */
export const updateItemStatus = async (plaidItemId: string, status: string): Promise<void> => {
  const items = await db.update(dimItems)
    .set({ status: status })
    .where(eq(dimItems.plaidItemId, plaidItemId));
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

/**
 * Retrieves all items and their accounts by client ID.
 *
 * @returns {Object} an item.
 */
export const retrieveItemsAccountsByClientId = async (clientId: number) => {
  const items = await db.select().from(dimItems)
    .leftJoin(dimAccounts, eq(dimItems.id, dimAccounts.itemId))
    .where(eq(dimItems.clientId, clientId));
  return result;
}