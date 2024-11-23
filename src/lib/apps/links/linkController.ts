import type { ItemAddResultRequest } from '$lib/apps/links/linkTypes';
import service from '$lib/apps/links/linkService';
import model from '$lib/apps/links/linkModel';
import plaid from '$lib/server/plaid';
import logger from '$lib/logger';

const linkController = {
    newLinkCreateRequest: async (clientId: number) => {
        try {
            const request = await service.constructLinkCreateRequest(clientId);
            const response = await plaid.linkTokenCreate(request);
            if (!response) {
                throw new Error('plaid.linkTokenCreate response is undefined or null');
            }
            const linkRequest = {
                'clientId': clientId,
                'linkToken': response.data['link_token'],
                'expiration': new Date(response.data['expiration']),
                'requestId': response.data['request_id'],
            };
            const link = await model.insertNewLinkRequest(linkRequest);

            return link;
        } catch (error) {
            logger.error(error);
            throw new Error('Failed to create a new link request');
        }
    },
    itemAddResult: async (payload: ItemAddResultRequest) => {
        try {
            const { 'link_token': linkToken, 'public_token': publicToken } = payload;
            const link = await model.updateLinkRequest(linkToken);
            const tokenRequest = { 'public_token': publicToken };
            const tokenResponse = await plaid.itemPublicTokenExchange(tokenRequest);

            const { 'access_token': accessToken, 'item_id': plaidItemId } = tokenResponse.data;
            const itemResponse = await plaid.itemGet({'access_token': accessToken});

            const { 'institution_id': plaidInstitutionId } = itemResponse.data.item;
            if (!plaidInstitutionId) {
                throw new Error('plaidInstitutionId is undefined or null');
            }
            const institution = await service.getInstitutionFromItem(plaidInstitutionId);
            await model.upsertInstitution(institution);

            const itemUpsertRequest = {
                'accessToken': accessToken, // tokenResponse.data['access_token']
                'plaidItemId': plaidItemId, // tokenResponse.data['item_id']
                'clientId': link.clientId,
                'institutionId': Number(plaidInstitutionId), // itemResponse.data.item['institution_id']
                'status': 'Active',
            }
            const item = await model.upsertItem(itemUpsertRequest);
            return item;
        } catch (error) {
            logger.error(error);
        }
    },
};

export default linkController;