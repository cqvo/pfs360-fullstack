import logger from '$lib/logger';
import model from '$lib/apps/client/model';

import { Item } from '$lib/apps/client/model';
import Client from '$lib/apps/client/class/Client';
import { parse } from 'csv-parse/sync';
import { CountryCode, type AssetReportCreateRequest, type LinkTokenCreateRequest, type LinkTokenCreateRequestUser, Products } from 'plaid';
import { PLAID_CLIENT_NAME, PLAID_EMAIL, WEBHOOK_URL } from '$lib/config';
import type { AxiosResponse } from 'npm:axios@1.7.7';
import { ObjectId } from 'mongodb';
import plaid from '$lib/server/plaid';
import TaxdomeRecord from '$lib/apps/client/class/TaxdomeRecord';
import { connectToDatabase } from '$lib/server/mongodb';

export class LinkTokenRequest implements LinkTokenCreateRequest {
	client_name: string;
	country_codes: Array<CountryCode>;
	language: string;
	products: Array<Products> | null;
	user: LinkTokenCreateRequestUser;

	constructor(client: Client) {
		this.user = {
			client_user_id: client.taxdomeId,
			email_address: PLAID_EMAIL || 'pfs@wumbo.tech',
		}
		this.client_name = PLAID_CLIENT_NAME || 'PFS360';
		this.products = [Products.Assets];
		this.country_codes = [CountryCode.Us];
		this.language = 'en';
	}
}

const clientService = {
	// getClient: async (clientId: string) => {
	// 	try	{
	// 		return await Client.findOne(clientId);
	// 	} catch (e) {
	// 		logger.error('Error in Service getClient:', e);
	// 		throw e;
	// 	}
	// },
	getClients: async () => {
		return await model.findClients();
	},
	getItem: async (itemId: string) => {
		try {
			return await model.findItem(itemId);
		} catch (e) {
			logger.error('Error in Service getItem:', e);
			throw e;
		}
	},
	processTaxdomeCsv: async (file: File) => {
		try {
			const content: string = await file.text();
			const clients: TaxdomeRecord[] = parse(content, {
				columns: ['taxdomeId', 'companyName', 'emailAddress']
			}).map((row: TaxdomeRecord) =>
				new TaxdomeRecord(row.taxdomeId, row.companyName, row.emailAddress)
			);
			if (clients.length === 0) {
				throw new Error('No records found in CSV');
			}
			const result = await TaxdomeRecord.updateClientList(clients);
			console.log(result);
		} catch (e) {
			logger.error(e);
			throw new Error(`Failed to process clients CSV: ${e instanceof Error ? e.message : String(e)}`);
		}
	},
	newLinkCreateRequest: async (client: Client) => {
		try {
			const request = new LinkTokenRequest(client);
			const response = await plaid.linkTokenCreate(request);
			await model.newLinkResponse(client.id, response);
			return response.data['link_token'];
		} catch (e) {
			logger.error('Error in Service newLinkCreateRequest:', e);
			throw e;
		}
	},
	webLinkOnSuccessHandler: async (client: Client, publicToken: string, accounts: App.Account[], linkToken: string) => {
		try {
			//close link token
			await model.updateLink(linkToken);
			//exchange token
			const tokenResponse = await plaid.itemPublicTokenExchange({ 'public_token': publicToken });
			const accessToken = tokenResponse.data['access_token'];
			//get item
			const response = await plaid.itemGet({ 'access_token': accessToken });
			const itemResponse = response.data.item;
			const item = Item.fromPlaidResponse(itemResponse);
			// add new item record
			return await model.insertItem(client.id, item.pojo());
		}	catch (e) {
			logger.error(e);
			throw e;
		}
	},
};

export default clientService;