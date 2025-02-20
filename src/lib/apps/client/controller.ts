import model from '$lib/apps/client/model';
import service from '$lib/apps/client/service';
import plaid from '$lib/server/plaid';

import { type ItemPublicTokenExchangeRequest } from 'plaid';

const clientController = {
	uploadClients: async (file: File) => {
		try {
			const records = await service.processTaxdomeCsv(file);
			return await service.updateClientList(records);
		} catch (error) {
			return null;
		}
	},
	getClients: async () => {
		return await model.findClients();
	},
	getClient: async (id: string) => {
		return await model.findClient(id);
	},
	requestLinkToken: async (client: App.ClientRecord) => {
		const request = await service.newLinkCreateRequest(client);
		const response = await plaid.linkTokenCreate(request);
		const result = await model.newLinkResponse(client._id, response);
		if (result.modifiedCount > 0) {
			return response.data['link_token'];
		}
		return null;
	},
};

export default clientController;