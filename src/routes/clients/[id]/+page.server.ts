import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';
import { eq } from 'drizzle-orm';
import { dimClients } from '$lib/server/database/schema';
export const load: PageServerLoad = async ({ params }) => {
	// @ts-ignore
	const client = await db.select().from(dimClients)
		.where(eq(dimClients.id, params.id));
	return {
		client
	};
}