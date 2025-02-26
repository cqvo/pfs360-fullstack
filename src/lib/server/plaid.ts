import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { VERCEL_ENV, PLAID_CLIENT_ID, PLAID_SECRET, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_BRANCH_URL } from '$env/static/private';

export const webhookUrl =
	VERCEL_ENV === 'production' ? `https://${VERCEL_PROJECT_PRODUCTION_URL}/api/v1/webhook` : `https://${VERCEL_BRANCH_URL}/api/v1/webhook`;

console.log(`Plaid webhook URL: ${webhookUrl}`);

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