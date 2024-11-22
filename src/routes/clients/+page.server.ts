import type { PageServerLoad } from './$types';
import { retrieveClientsItems } from '$lib/server/database/queries/clients';

export const load: PageServerLoad = async () => {
	const clients = await retrieveClientsItems();
	return {
		clients
	};
}