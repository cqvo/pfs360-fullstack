import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { VERCEL_ENV, PLAID_CLIENT_ID, PLAID_SECRET } from '$env/static/private';

const configuration = new Configuration({
	basePath: VERCEL_ENV !== 'production' ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
});

const plaid = new PlaidApi(configuration);

export default plaid;