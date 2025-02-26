import type {
	AssetReportCreateRequest,
	AssetReportCreateRequestOptions,
	AssetReportGetRequest,
	AssetReportGetResponse
} from 'plaid';
import plaid from '$lib/server/plaid';
import Client from '$lib/apps/client/class/Client';
import { WEBHOOK_URL } from '$lib/config';
import { connectToDatabase } from '$lib/server/mongodb';
import Item from '$lib/apps/client/class/Item';
import Account from '$lib/apps/client/class/Account';
import type HistoricalBalance from '$lib/apps/client/type/HistoricalBalance';

export default class Report {
	reportToken: string;
	reportId: string;
	requestId: string;
	raw?: AssetReportGetResponse;
	createdAt: Date;
	updatedAt: Date;

	constructor(reportToken: string, reportId: string, requestId: string, raw?: AssetReportGetResponse, createdAt?: Date, updatedAt?: Date) {
		this.reportToken = reportToken;
		this.reportId = reportId;
		this.requestId = requestId;
		this.raw = raw;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	static async fetchReport(request: AssetReportGetRequest) {
		const response = await plaid.assetReportGet(request);
		return response.data;
	}

	static async findOne(reportId: string) {
		const { db } = await connectToDatabase();
		const collection = db.collection('reports');
		const record = await collection.findOne({
			asset_report_id: reportId
		});
		if (!record) throw new Error('Report findOne: Report not found');
		return new Report(
			record['asset_report_token'],
			record['asset_report_id'],
			record['request_id'],
			record['raw'],
			record['created_at'],
			record['updated_at']);
	}

	static constructCreateRequest(client: Client, item: Item): AssetReportCreateRequest {
		const daysRequested = 61;
		const options: AssetReportCreateRequestOptions = {
			'webhook': WEBHOOK_URL,
			'user': {
				'client_user_id': client.taxdomeId,
				'email': client.emailAddress,
			},
		}
		return {
			'access_tokens': [ item.accessToken ],
			'days_requested': daysRequested,
			'options': options,
		}
	}

	static async createNewRequest(request: AssetReportCreateRequest) {
		const response = await plaid.assetReportCreate(request);
		if (!response || !response.data) {
			throw new Error('Failed to create asset report request');
		}
		const report = new Report(
			response.data['asset_report_token'],
			response.data['asset_report_id'],
			response.data['request_id']
		);
		const result = await report.insertStub();
		return result.acknowledged;
		console.log('Report createNewRequest', report);
	}

	async insertStub() {
		const { db } = await connectToDatabase();
		const collection = db.collection('reports');
		const document = {
			'asset_report_token': this.reportToken,
			'asset_report_id': this.reportId,
			'request_id': this.requestId,
			'created_at': this.createdAt,
			'updated_at': this.updatedAt,
		};
		return await collection.insertOne(document);
	}

	async updateReport() {
		const request: AssetReportGetRequest = {
			'asset_report_token': this.reportToken,
		}
		const response = await plaid.assetReportGet(request);
		this.raw = response.data;
		this.updatedAt = new Date();
		const { db } = await connectToDatabase();
		const collection = db.collection('reports');
		const result = await collection.updateOne(
			{	'asset_report_id': this.reportId },
			{ $set: { raw: this.raw, updatedAt: this.updatedAt } },
			);
		console.log('Report updateReport', result);
		return result;
	}

	getAccounts() {
		if (!this.raw) throw new Error('Report getAccounts: Raw report data not found');
		const accounts = [];
		const taxdomeId = this.raw.report.user['client_user_id'] || '';
		for (const account of this.raw.report.items[0].accounts) {
			const historicalBalances = [];
			for (const balance of account['historical_balances']) {
				const historicalBalance: HistoricalBalance = {
					current: balance['current'],
					date: new Date(balance['date']),
					currencyCode: balance['iso_currency_code'],
				};
				historicalBalances.push(historicalBalance);
			}
			const transactions = [];
			for (const transaction of account['transactions']) {
				transactions.push({
					amount: transaction['amount'],
					date: new Date(transaction['date']),
					description: transaction['original_description'] || '',
					currencyCode: transaction['iso_currency_code'] || '',
					pending: transaction['pending'],
					id: transaction['transaction_id'],
				});
			}
			accounts.push(new Account(
				taxdomeId,
				account['account_id'],
				historicalBalances,
				transactions,
				account['mask'],
				account['name'],
				account['official_name'],
			));
		}
		return accounts;
	}
}