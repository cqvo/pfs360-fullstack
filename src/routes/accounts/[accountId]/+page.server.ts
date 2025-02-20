import type { Actions, PageServerLoad } from './$types';
import clientService from '$lib/apps/client/service';
import reportService from '$lib/apps/report/service';
import Client from '$lib/apps/client/class/Client';
import logger from '$lib/logger';
import { error } from '@sveltejs/kit';

let client: Client;
let item: App.Item;

export const load: PageServerLoad = async ({ params }) => {
	try {
		if (client == null) {
			client =  await Client.findOne(params.clientId);
		}
		const items = client.items!;
		// item = items.find(item => item.id === params.itemId)!;
		return {
			companyName: client.companyName,
			// item: item,
		};
	} catch (e) {
		console.error('Error in Controller [accountId]/+page.server.ts:', e);
	}
};

export const actions = {
	requestData: async ({ request }) => {
		await clientService.newReportRequest(client, item);
		return { success: true };
	}
} satisfies Actions;