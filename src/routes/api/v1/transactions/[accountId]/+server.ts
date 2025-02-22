import type { RequestHandler } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/mongodb';

export const GET: RequestHandler = async ({ params }) => {
	const accountId = params.accountId;
	const { db } = await connectToDatabase();
	const account = await db.collection('accounts').findOne({ account_id: accountId });

	if (!account) {
		return new Response('Account not found', { status: 404 });
	}

	// Assume each balance entry has a date and current (balance) field.
	// Adjust the header and row fields as needed.
	const header = ['date', 'amount','description','pending'];
	const rows = [header.join(',')];

	// If dates are stored as Date objects in MongoDB they may be returned as strings;
	// we format them consistently.
	for (const entry of account.transactions) {
		const date = new Date(entry.date).toISOString();
		const amount = entry.amount;
		const description = entry.original_description;
		const pending = entry.pending;
		rows.push(`${date},${amount},${description},${pending}`);
	}

	const csvContent = rows.join('\n');

	return new Response(csvContent, {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': `attachment; filename="${account.name}_${account.mask}_transactions.csv"`
		}
	});

};
