import { describe, it, expect, vi } from 'vitest';
import linkService from './linkService';
import model from '$lib/apps/links/linkModel';
import plaid from '$lib/server/plaid';
import logger from '$lib/logger';
import { PLAID_CLIENT_NAME, PLAID_EMAIL, WEBHOOK_URL } from '$lib/config';
import { CountryCode, Products, HostedLinkDeliveryMethod } from 'plaid';

vi.mock('$lib/apps/links/linkModel');
vi.mock('$lib/server/plaid');
vi.mock('$lib/logger');

describe('linkService.constructLinkCreateRequest', () => {
        it('should construct a valid link create request', async () => {
            const clientId = 1;
            const client = { taxdomeId: '12345' };
            model.retrieveClientById.mockResolvedValue(client);

            const request = await linkService.constructLinkCreateRequest(clientId);

            expect(request).toEqual({
                user: {
                    client_user_id: client.taxdomeId,
                    email_address: PLAID_EMAIL || 'cqvo@proton.me',
                },
                client_name: PLAID_CLIENT_NAME || 'PFS 360',
                products: [Products.Assets],
                country_codes: [CountryCode.Us],
                language: 'en',
                webhook: WEBHOOK_URL,
                hosted_link: { delivery_method: HostedLinkDeliveryMethod.Email }
            });
        });

        it('should throw an error if client retrieval fails', async () => {
            const clientId = 1;
            const errorMessage = 'Client not found';
            model.retrieveClientById.mockRejectedValue(new Error(errorMessage));

            await expect(linkService.constructLinkCreateRequest(clientId)).rejects.toThrow(`Failed to construct link request: ${errorMessage}`);
        });
    });

describe('linkService.getInstitutionFromItem', () => {
    it('should return institution details from plaid', async () => {
        const plaidInstitutionId = 'ins_123';
        const institutionData = {
            institution_id: plaidInstitutionId,
            name: 'Test Bank',
        };
        plaid.institutionsGetById.mockResolvedValue({ data: { institution: institutionData } });

        const institution = await linkService.getInstitutionFromItem(plaidInstitutionId);

        expect(institution).toEqual({
            plaidInstitutionId: institutionData.institution_id,
            name: institutionData.name,
        });
    });

    it('should throw an error if plaid response is undefined or null', async () => {
        const plaidInstitutionId = 'ins_123';
        plaid.institutionsGetById.mockResolvedValue(null);

        await expect(linkService.getInstitutionFromItem(plaidInstitutionId)).rejects.toThrow('plaid.institutionsGetById response is undefined or null');
    });

    it('should throw an error if plaid request fails', async () => {
        const plaidInstitutionId = 'ins_123';
        const errorMessage = 'Plaid request failed';
        plaid.institutionsGetById.mockRejectedValue(new Error(errorMessage));

        await expect(linkService.getInstitutionFromItem(plaidInstitutionId)).rejects.toThrow(`Failed to get institution from item: ${errorMessage}`);
    });
});