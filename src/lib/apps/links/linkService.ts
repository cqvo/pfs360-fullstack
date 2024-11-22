import { retrieveClientById } from '$lib/server/database/queries/clients';
import plaid from '$lib/server/plaid';

import { PLAID_CLIENT_NAME, PLAID_EMAIL, PLAID_WEBHOOK_URL } from '$env/static/private';

const linkService = {
    constructLinkCreateRequest: async (clientId: number) => {
        try {
            const client = await retrieveClientById(clientId);
            const request = {
                user: {
                    client_user_id: client.id,
                    email_address: PLAID_EMAIL || 'cqvo@proton.me',
                },
                client_name: PLAID_CLIENT_NAME || 'PFS 360',
                products: ['assets'],
                country_codes: ['US'],
                language: 'en',
                webhook: PLAID_WEBHOOK_URL || 'https://webhook.example.com',
                hosted_link: { delivery_method: 'email' }
            };
            return request;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    },
    getInstitutionFromItem: async (plaidInstitutionId: string) => {
        try {
            const request = {
                'institution_id': plaidInstitutionId,
                'country_codes': ['US'],
            };
            const response = await plaid.institutionsGetById(request);
            const institution = response.data.institution;
            return institution;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    },
};

export default linkService;