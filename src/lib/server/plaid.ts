import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { VERCEL_ENV, PLAID_CLIENT_ID, PLAID_SECRET } from '$lib/config';

const configuration = new Configuration({
	basePath: VERCEL_ENV !== 'production' ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
});

console.log('Plaid ID:', PLAID_CLIENT_ID);
console.log('Plaid env:', VERCEL_ENV !== 'production' ? PlaidEnvironments.sandbox : PlaidEnvironments.production)
console.log('Plaid Secret:', PLAID_SECRET);

const plaid = new PlaidApi(configuration);

export default plaid;