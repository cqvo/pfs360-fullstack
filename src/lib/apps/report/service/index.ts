import { Client } from '$lib/apps/client/model';
import model from '$lib/apps/report/model';
import { encrypt, decrypt } from '$lib/server/crypto';
import type { AssetReportCreateRequest } from 'plaid';
import plaid from '$lib/server/plaid';

const reportService = {
	newReportRequest: async (client: Client, item: App.Item) => {
		if (!item.ivHexString) {
			throw new Error('error');
		}
		const accessToken = await decrypt(item.accessToken, item.ivHexString);
		const response = await plaid.assetReportCreate({
			'access_tokens': [ accessToken ],
			'days_requested': 61,
		});
		// create new asset report document
		const result = await model.insertReportStub(client.id, response.data);
	},
};

export default reportService;