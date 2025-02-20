import { connectToDatabase } from '$lib/server/mongodb';
import { parse } from 'csv-parse/sync';

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

	static async processCsv(file: File) {
		const content: string = await file.text();
		const clients: TaxdomeRecord[] = parse(content, {
			columns: ['taxdomeId', 'companyName', 'emailAddress'],
			skip_empty_lines: true
		}).map((row: TaxdomeRecord) =>
			new TaxdomeRecord(row.taxdomeId, row.companyName, row.emailAddress)
		);
		if (clients.length === 0) {
			throw new Error('No records found in CSV');
		}
		const result = await TaxdomeRecord.updateClientList(clients);
		console.log('CSV processing complete:', result);
		return result;
	}
}