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

console.log(`Plaid config - Env: ${configuration.basePath}; ID: ${configuration.baseOptions.headers['PLAID-CLIENT-ID']}`);

const plaid = new PlaidApi(configuration);

export default plaid;