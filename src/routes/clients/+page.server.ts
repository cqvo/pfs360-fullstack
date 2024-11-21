import type { PageServerLoad } from './$types';
import { retrieveClientsItems } from '$lib/server/database/queries/clients';

export const load: PageServerLoad = async () => {
	const clients = await retrieveClientsItems();
	// clients.forEach((client) => {
	// 	if (client.dimItems.length === 0) client.dimItems.push({status: 'N/A'});
	// });
	return {
		clients
	};
}