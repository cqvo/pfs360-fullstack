import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
	basePath: process.env.NODE_ENV !== 'production' ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
			'PLAID-SECRET': process.env.PLAID_SECRET,
		},
	},
});

const plaid = new PlaidApi(configuration);

export default plaid;