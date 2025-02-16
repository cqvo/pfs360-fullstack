import type { PageServerLoad } from './$types';
import clientService from '$lib/apps/client/service';

export const load: PageServerLoad = async () => {
	const clients = await clientService.getClients();
	return {
		clients: clients.map(client => ({ ...client, id: client.id.toString() }))
	};
}