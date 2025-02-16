import type { Actions, PageServerLoad } from './$types';
import clientService from '$lib/apps/client/service';
import { Client } from '$lib/apps/client/model';
import logger from '$lib/logger';
import { error } from '@sveltejs/kit';

let client: Client;
let item: App.Item;

export const load: PageServerLoad = async ({ params }) => {
	try {
		client = await clientService.getClient(params.clientId);
		const items = client.items!;
		item = items.find(item => item.id === params.itemId)!;
		return {
			companyName: client.companyName,
			item: item,
		};
	} catch (e) {
		console.error('Error in Controller [clientId]/+page.server.ts:', e);
		throw error(500, 'Error in Controller [clientId]/+page.server.ts')
	}
};

export const actions = {
	requestData: async ({ request }) => {
		await clientService.newReportRequest(client, item);
		return { success: true };
	}
} satisfies Actions;