import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { VERCEL_ENV, PLAID_CLIENT_ID, PLAID_SECRET } from '$lib/config';
import logger from '$lib/logger';

const configuration = new Configuration({
	// basePath: VERCEL_ENV !== 'production' ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
});

logger.info(`Plaid config - Env: ${configuration.basePath}; ID: ${configuration.baseOptions.headers['PLAID-CLIENT-ID']}`);

const plaid = new PlaidApi(configuration);

export default plaid;