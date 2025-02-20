import { connectToDatabase } from '$lib/server/mongodb';
import type { WithId } from 'mongodb';
import type { AssetReportCreateResponse } from 'plaid';

const reportModel = {
// Find report by reportId

// Insert new report
	insertReportStub: async (clientId: string, response: AssetReportCreateResponse) => {
		const { db } = await connectToDatabase();
		const collection = db.collection<App.AssetReport>('reports');
		const report = {
			clientId: clientId,
			id: response['asset_report_id'],
			token: response['asset_report_token'],
			requestId: response['request_id'],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const result = await collection.insertOne(report);
		console.log(`A document was inserted with the _id: ${result.insertedId}`);
	},
// Update existing report
}

export default reportModel;