import type { Actions, PageServerLoad } from './$types';
import linkController from '$lib/apps/links/linkController';
import clientController from '$lib/apps/clients/controller';

export const load: PageServerLoad = async ({ params }) => {
	const clientId = Number(params.id);
	const items = await clientController.retrieveItemsByClientId(clientId);
	const client = await clientController.retrieveClientById(clientId)
	return {
		items, client
	};
}

export const actions = {
	createLink: async({ params }) => {
		const clientId = Number(params.id);
		linkController.newLinkCreateRequest(clientId);
	},
} satisfies Actions;