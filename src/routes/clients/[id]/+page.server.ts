import type { Actions, PageServerLoad } from './$types';
import linkController from '$lib/apps/links/linkController';
import clientController from '$lib/apps/clients/controller';

export const load: PageServerLoad = async ({ params }) => {
	const clientId = Number(params.id);
	const client = await clientController.retrieveClientById(clientId);
	const items = await clientController.retrieveItemsByClientId(clientId);
	return {
		items, client
	};
}

export const actions = {
	createLink: async({ params }) => {
		const clientId = Number(params.id);
		try {
			const linkRequest = linkController.newLinkCreateRequest(clientId);
			return {
				success: true,
				linkToken: linkRequest.linkToken,
			}
		} catch (error) {
			console.error('Error creating link token:', error);
			return {
				success: false,
				error: 'Failed to create link token',
			}
		}
	},
} satisfies Actions;