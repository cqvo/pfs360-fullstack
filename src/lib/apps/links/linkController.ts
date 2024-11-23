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

            const itemPayload = {
                'accessToken': accessToken, // tokenResponse.data['access_token']
                'plaidItemId': plaidItemId, // tokenResponse.data['item_id']
                'clientId': link.clientId,
                'institutionId': plaidInstitutionId, // itemResponse.data.item['institution_id']
                'status': 'Active',
            }
            const item = await model.upsertItem(itemPayload);
            return item;
        } catch (error) {
            logger.error(error);
        }
    },
};

export default linkController;