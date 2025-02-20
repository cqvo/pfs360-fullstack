import { connectToDatabase } from '$lib/server/mongodb';

export default class TaxdomeRecord {
	taxdomeId: string;
	companyName: string;
	emailAddress: string;

	constructor (taxdomeId: string, companyName: string, emailAddress: string) {
		this.taxdomeId = taxdomeId;
		this.companyName = companyName;
		this.emailAddress = emailAddress;
	}

	toBulkOperation() {
		return {
			updateOne: {
				filter: { taxdome_id: this.taxdomeId },
				update: {
					$set: {
						company_name: this.companyName,
						email_address: this.emailAddress,
					},
					$setOnInsert: {
						taxdome_id: this.taxdomeId,
					},
				},
				upsert: true,
			},
		};
	}

	static async updateClientList(clients: TaxdomeRecord[]) {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const operations = clients.map((client) => client.toBulkOperation());
		return await collection.bulkWrite(operations);
	}
}