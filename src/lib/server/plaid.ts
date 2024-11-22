import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const NODE_ENV = Deno.env.get('NODE_ENV') || 'development';
const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID');
const PLAID_SECRET = Deno.env.get('PLAID_SECRET');

const configuration = new Configuration({
	basePath: NODE_ENV !== 'production' ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
});

const plaid = new PlaidApi(configuration);

export default plaid;