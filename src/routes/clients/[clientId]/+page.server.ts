import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import clientModel from '$lib/apps/client/model';
import reportService from '$lib/apps/report/service';
import logger from '$lib/logger';
// import { Client } from '$lib/apps/client/model';
import Client from '$lib/apps/client/class/Client';
import Link from '$lib/apps/client/class/Link';
import Item from '$lib/apps/client/class/Item';
import Report from '$lib/apps/client/class/Report';

let client: Client | null;
let link: Link | null;

export const load: PageServerLoad = async ({ params }) => {
	try {
		if (client == null) {
			client =  await Client.findOne(params.clientId);
		}
		link = await client.findValidLink();
		return {
			companyName: client.companyName,
			items: client.items,
			...(link ? { linkToken: link.linkToken } : {})
		};
	} catch (e) {
		console.error('1Error in Controller [clientId]/+page.server.ts:', e);
		throw error(500, '2Error in Controller [clientId]/+page.server.ts', e);
	}
};

export const actions = {
	newToken: async () => {
		try {
			const request = Link.constructCreateRequest(client);
			link = await Link.createNewToken(request);
			// await link.addToClient(client);
			await client.addLink(link);
			return {
				success: true,
				linkToken: link.linkToken
			};
		} catch (e) {
			logger.error('Error in [clientId]/+page.server.ts:', e);
			throw error(500, 'Error in [clientId]/+page.server.ts');
		}
	},
	onSuccess: async ({ request }) => {
		try {
			// await link!.removeFromClient(client);
			await client.removeLink(link);
			const data = await request.formData();
			const exchangeResponse = await Item.exchangePublicToken(data.get('publicToken'));
			const item = new Item({ props: {
				itemId: exchangeResponse['item_id'],
				raw: exchangeResponse,
			}});
			console.log('Item', item);
			item.accessToken = exchangeResponse['access_token'];
			await item.updateItem();
			await item.updateAccounts();
			await client.upsertItem(item);
			return { success: true };
		} catch (e) {
			throw error(500, `Error processing onSuccess: ${e}`);
		}
	},
	requestData: async ({ request }) => {
		const data = await request.formData();
		const itemIndex = data.get('itemIndex');
		const itemData = client.items[itemIndex];
		const item = new Item({ props: {
			itemId: itemData.itemId,
				institutionName: itemData.institutionName,
				_encryptedToken: itemData._encryptedToken,
				_ivHexString: itemData._ivHexString,
				accounts: itemData.accounts,
				raw: itemData.raw,
			}});
		if (!client || !item) {
			throw new Error('Not Found');
		}
		const reportRequest = Report.constructCreateRequest(client, item);
		await Report.createNewRequest(reportRequest);
	}
} satisfies Actions;
