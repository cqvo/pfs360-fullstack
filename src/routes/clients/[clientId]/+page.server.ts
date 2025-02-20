import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import logger from '$lib/logger';
import Client from '$lib/apps/client/class/Client';
import Link from '$lib/apps/client/class/Link';
import Item from '$lib/apps/client/class/Item';
import Report from '$lib/apps/client/class/Report';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const client = await Client.findOne(params.clientId);
		const link = await client.findValidLink();
		return {
			companyName: client.companyName,
			items: client.items,
			...(link ? { linkToken: link.linkToken } : {})
		};
	} catch (e) {
		console.error('Error in PageServerLoad [clientId]/+page.server.ts:', e);
	}
};

export const actions = {
	newToken: async ({ params }) => {
		try {
			const client = await Client.findOne(params.clientId);
			const request = Link.constructCreateRequest(client);
			const link = await Link.createNewToken(request);
			await client.addLink(link);
			if (link) {
			return {
				success: true,
				linkToken: link.linkToken
			};}
		} catch (e) {
			logger.error('Error in [clientId]/+page.server.ts:', e);
			throw error(500, 'Error in [clientId]/+page.server.ts');
		}
	},
	onSuccess: async ({ request, params }) => {
		try {
			// await link!.removeFromClient(client);
			const client = await Client.findOne(params.clientId);
			const link = await client.findValidLink();
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
	requestData: async ({ request, params }) => {
		const client = await Client.findOne(params.clientId);
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
