import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { createLogger } from '$lib/server/Logger';
import { VERCEL_ENV, PLAID_CLIENT_ID, PLAID_SECRET, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_BRANCH_URL } from '$env/static/private';

const logger = createLogger({ component: '$lib/server/Plaid' });

export const webhookUrl =
	VERCEL_ENV === 'production' ? `https://${VERCEL_PROJECT_PRODUCTION_URL}/api/v1/webhook` : `https://${VERCEL_BRANCH_URL}/api/v1/webhook`;

const configuration = new Configuration({
	basePath: VERCEL_ENV !== 'production' ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
});

logger.info(`Configured Plaid - Env: ${configuration.basePath}; Webhook: ${webhookUrl}; ID: ${configuration.baseOptions.headers['PLAID-CLIENT-ID']}`);

export const Plaid = new PlaidApi(configuration);