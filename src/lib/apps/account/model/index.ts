import { connectToDatabase } from '$lib/server/mongodb';
import { ObjectId } from 'mongodb';

const accountModel = {
	findAccount: async (accountId: string) => {
		const { db } = await connectToDatabase();
		const collection = db.collection('accounts');
		const account = await collection.findOne({
			'account_id': accountId
		});
		if (!account) throw new Error('Account not found');
		return account;
	}
};

export default accountModel;