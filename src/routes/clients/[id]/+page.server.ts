import type { PageServerLoad } from './$types';
import { retrieveClientItemsById } from '$lib/server/database/queries/clients';

export const load: PageServerLoad = async ({ params }) => {
	const result = await retrieveClientItemsById(Number(params.id));
	const clients = result[0];
	console.log(clients);
	return { clients };
}

// For each client:
// Items -> Accounts
// Items -> Institutions