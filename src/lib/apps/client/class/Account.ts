import HistoricalBalance from '$lib/apps/client/class/HistoricalBalance';
import { connectToDatabase } from '$lib/server/mongodb';
import { ObjectId } from 'mongodb';

export default class Account {
	accountId: string;
	historicalBalances: HistoricalBalance[];
	mask: string;
	officialName: string;

	constructor(accountId: string, historicalBalances: HistoricalBalance[], mask: string, officialName: string) {
		this.accountId = accountId;
		this.historicalBalances = historicalBalances;
		this.mask = mask;
		this.officialName = officialName;
	}

	toBulkOperation() {
		return {
			updateOne: {
				filter: {
					account_id: this.accountId,
				},
				update: {
					$set: {
						historical_balances: this.historicalBalances,
						mask: this.mask,
						officialName: this.officialName,
					},
					$setOnInsert: {
						account_id: this.accountId,
					},
				},
				upsert: true,
			},
		};
	}

	static async updateAccounts(accounts: Account[]) {
		const { db } = await connectToDatabase();
		const collection = db.collection('accounts');
		const operations = accounts.map( account => account.toBulkOperation());
		return await collection.bulkWrite(operations);
	}

	// Upsert each historical balance based on its date
	async upsertHistoricalBalances() {
		const { db } = await connectToDatabase();
		const collection = db.collection('accounts');

		// Ensure the account exists (create if necessary)
		await collection.updateOne(
			{ account_id: this.accountId },
			{
				$setOnInsert: {
					account_id: this.accountId,
					mask: this.mask,
					officialName: this.officialName,
					historical_balances: [],
				},
			},
			{ upsert: true }
		);

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
}