import type { PageServerLoad } from './$types';
// import clientService from '$lib/apps/client/service';
import Client from '$lib/apps/client/class/Client';
export const load: PageServerLoad = async () => {
	const results = await Client.findAll();
	const clients = results.map(result => result.pojo());
	return {
		clients
	};
}