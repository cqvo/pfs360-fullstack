import logger from '$lib/logger';
import model from '$lib/apps/client/model';
import { Client, Item } from '$lib/apps/client/model';
import { parse } from 'csv-parse/sync';
import { CountryCode, type AssetReportCreateRequest, type LinkTokenCreateRequest, type LinkTokenCreateRequestUser, Products } from 'plaid';
import { PLAID_CLIENT_NAME, PLAID_EMAIL, WEBHOOK_URL } from '$lib/config';
import type { AxiosResponse } from 'npm:axios@1.7.7';
import { ObjectId } from 'mongodb';
import plaid from '$lib/server/plaid';

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
	getClient: async (clientId: string) => {
		try	{
			return await model.findClient(clientId);
		} catch (e) {
			logger.error('Error in Service getClient:', e);
			throw e;
		}
	},
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
			const content = await file.text();
			const records: Array<App.TaxdomeRecord> = parse(content, { columns: ['taxdomeId', 'companyName', 'emailAddress'] });
			if (!records || records.length === 0) {
				logger.error('No records found in CSV');
			}
			return records;
		} catch (e) {
			logger.error(e);
			throw new Error(`Failed to process clients CSV: ${e instanceof Error ? e.message : String(e)}`);
		}
	},
	updateClientList: async (records: App.TaxdomeRecord[]) => {
		const result = await model.upsertClients(records);
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
	webLinkOnSuccess: async (client, publicToken, metadata, linkToken) => {
		try {
			//close link token
			await model.updateLink(linkToken);
			//exchange token
			const tokenRequest = { 'public_token': publicToken };
			const tokenResponse = await plaid.itemPublicTokenExchange(tokenRequest);
			const accessToken = tokenResponse.data['access_token'];
			//get item
			const itemRequest = { 'access_token': accessToken };
			const itemResponse = await plaid.itemGet(itemRequest);
			const item = new Item(itemResponse, metadata, accessToken);
			// add new item record
			return await model.insertItem(client.id, item.pojo());
		}	catch (e) {
			logger.error(e);
			throw e;
		}
	},
	newReportRequest: async (client: Client, item: App.Item) => {
		const request: AssetReportCreateRequest = {
			'access_tokens': [ item.accessToken ],
			'days_requested': 61,
		};
		const response = await plaid.assetReportCreate(request);
		const assetReportId = response.data.asset_report_id;
		const assetReportToken = response.data.asset_report_token;
		// create new asset report document
	},
};

export default clientService;