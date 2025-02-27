import type HistoricalBalance from '$lib/apps/client/type/HistoricalBalance';
import type Transaction from '$lib/apps/client/type/Transaction';
import { connectToDatabase } from '$lib/server/Mongodb';
import type { Db } from 'mongodb';

export default class Account {
	clientTaxdomeId: string;
	accountId: string;
	historicalBalances: HistoricalBalance[];
	transactions: Transaction[];
	mask: string;
	name: string;
	officialName: string;
	private _db: Db | null = null;

	constructor(taxdomeId: string, accountId: string, historicalBalances: HistoricalBalance[], transactions: Transaction[], mask: string, name: string, officialName: string) {
		this.clientTaxdomeId = taxdomeId;
		this.accountId = accountId;
		this.historicalBalances = historicalBalances;
		this.transactions = transactions;
		this.mask = mask;
		this.name = name;
		this.officialName = officialName;
	}

	async getDb() {
		if (!this._db) {
			const { db } = await connectToDatabase();
			this._db = db;
		}
		return this._db;
	}

	async upsertAccount() {
		const db = await this.getDb();
		const collection = db.collection('accounts');
		await collection.updateOne(
			{ account_id: this.accountId },
			{
				$setOnInsert: {
					client_user_id: this.clientTaxdomeId,
					account_id: this.accountId,
					mask: this.mask,
					name: this.name,
					officialName: this.officialName,
					historical_balances: [],
					transactions: [],
				},
			},
			{ upsert: true }
		);
	}

	// Upsert each historical balance based on its date
	async upsertHistoricalBalances() {
		const db = await this.getDb();
		const collection = db.collection('accounts');

		// Ensure the account exists (create if necessary)
		await this.upsertAccount();

		// Loop over each balance and try to update an existing entry
		for (const balance of this.historicalBalances) {
			const updateResult = await collection.updateOne(
				{
					account_id: this.accountId,
					"historical_balances.date": balance.date,
				},
				{
					$set: {
						"historical_balances.$": balance,
					},
				}
			);

			// If no matching balance is found, push the new balance into the array
			if (updateResult.modifiedCount === 0) {
				await collection.updateOne(
					{ account_id: this.accountId },
					{
						$push: { historical_balances: balance },
					}
				);
			}
		}
	}

	async upsertTransactions() {
		const db = await this.getDb();
		const collection = db.collection('accounts');

		// Ensure the account exists (create if necessary)
		await this.upsertAccount();

		// Loop over each transaction and try to update an existing entry
		const transaction = this.transactions[0];
		for (const transaction of this.transactions) {
			const updateResult = await collection.updateOne(
				{
					account_id: this.accountId,
					"transactions.transaction_id": transaction.id,
				},
				{
					$set: {
						"transactions.$": transaction,
					},
				}
			);

			// If no matching transaction is found, push the new transaction into the array
			if (updateResult.modifiedCount === 0) {
				await collection.updateOne(
					{ account_id: this.accountId },
					{
						$push: { transactions: transaction },
					}
				);
			}
		}
	}
}