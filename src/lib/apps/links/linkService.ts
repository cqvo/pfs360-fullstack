import {
    PLAID_CLIENT_NAME,
    PLAID_EMAIL, VERCEL_BRANCH_URL,
    VERCEL_ENV,
    VERCEL_PROJECT_PRODUCTION_URL
} from '$env/static/private';
import model from '$lib/apps/links/linkModel';
import plaid from '$lib/server/plaid';
import logger from '$lib/logger';
import { CountryCode, Products } from 'plaid';
const	WEBHOOK_URL =
  VERCEL_ENV === 'production' ? `https://${VERCEL_PROJECT_PRODUCTION_URL}/api/v1/webhook` : `https://${VERCEL_BRANCH_URL}/api/v1/webhook`;
const linkService = {
    constructLinkCreateRequest: async (clientId: number) => {
        try {
            const client = await model.retrieveClientById(clientId);
            const request = {
                'user': {
                    'client_user_id': client.taxdomeId,
                    'email_address': PLAID_EMAIL || 'cqvo@proton.me',
                },
                'client_name': PLAID_CLIENT_NAME || 'PFS360',
                'products': [Products.Assets],
                'country_codes': [CountryCode.Us],
                'language': 'en',
                'webhook': WEBHOOK_URL,
                // 'hosted_link': {
                //     'delivery_method': HostedLinkDeliveryMethod.Email,
                //     'url_lifetime_seconds': 600, // 10 minutes
                //     'completion_redirect_uri': 'https://internal.pfs360.com',
                //     'is_mobile_app': false,
                // }
            };
            return request;
        } catch (error) {
            logger.error(error);
            throw new Error(`Failed to construct link request: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    getInstitutionFromItem: async (plaidInstitutionId: string) => {
        try {
            const request = {
                'institution_id': plaidInstitutionId,
                'country_codes': [CountryCode.Us],
            };
            const response = await plaid.institutionsGetById(request);
            if (!response) {
                throw new Error('plaid.institutionsGetById response is undefined or null');
            }
            const data = response.data.institution;
            const institution = {
                'plaidInstitutionId': data['institution_id'],
                'name': data['name'],
            };
            return institution;
        } catch (error) {
            logger.error(error);
            throw new Error(`Failed to get institution from item: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
};

export default linkService;