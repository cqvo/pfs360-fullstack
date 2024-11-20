import type { PageServerLoad } from './$types';
import { retrieveClients } from '$lib/server/database/queries/clients';

export const load: PageServerLoad = async () => {
	const clients = await retrieveClients();;
	return {
		clients
	};
}