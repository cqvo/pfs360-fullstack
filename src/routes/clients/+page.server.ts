import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';
import { dimClients } from '$lib/server/database/schema';
export const load: PageServerLoad = async () => {
	const clients = await db.select().from(dimClients);
	return {
		clients
	};
}