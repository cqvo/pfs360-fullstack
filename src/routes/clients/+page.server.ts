import type { PageServerLoad } from './$types';
import clientController from '$lib/apps/clients/controller';

export const load: PageServerLoad = async () => {
	const clients = await clientController.retrieveItems();
	return {
		clients
	};
}