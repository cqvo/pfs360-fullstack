import db from '$lib/server/database';
import { factReportRequests, dimItems, factLinkRequests, dimClients } from '$lib/server/database/schema';
import { sql, eq, lt, gte, ne } from 'drizzle-orm';
import { encrypt, decrypt } from '$lib/server/crypto';
import logger from '$lib/logger';

const reportModel = {
    retrieveClientById: async (clientId: number) => {
        try {
            const result = await db.query.dimClients.findFirst({
                where: eq(dimClients.id, clientId),
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveClientById: ${clientId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving client by ID:', error);
            throw new Error(`Failed to retrieve client by ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveAccessToken: async (itemId: number) => {
        try {
            const result = await db.query.dimItems.findFirst({
                where: eq(dimItems.id, itemId),
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveAccessToken: ${itemId}`);
            }
            if (!result.accessToken || !result.accessTokenIv) {
                throw new Error(`Missing access token or IV for item: ${itemId}`);
            }
            const accessToken = await decrypt(result.accessToken, result.accessTokenIv);
            return accessToken;
        } catch (error) {
            logger.error('Error retrieving access token:', error);
            throw new Error(`Failed to retrieve access token: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    createNewReportRequest: async (assetReportId: string, assetReportToken: string, clientId: number, requestId: string, daysRequested: number) => {
        try {
            const result = await db.insert(factReportRequests).values({
                plaidReportId: assetReportId,
                reportToken: assetReportToken,
                clientId: clientId,
                plaidRequestId: requestId,
                daysRequested: daysRequested,
            }).returning();
            if (!result) {
                throw new Error('No rows returned from createNewReportRequest');
            }
            return result;
        } catch (error) {
            logger.error('Error creating new report request:', error);
            throw new Error(`Failed to create new report request: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    retrieveReportById: async (assetReportId: string) => {
        try {
            const result = await db.query.factReportRequests.findFirst({
                where: eq(factReportRequests.plaidReportId, assetReportId),
            });
            if (!result) {
                throw new Error(`No rows returned from retrieveReportToken: ${assetReportId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error retrieving report token:', error);
            throw new Error(`Failed to retrieve report token: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    storeReport: async (reportId: number, reportData: any) => {
        try {
            const result = await db.update(factReportRequests)
                .set({ data: reportData, })
                .where( eq(factReportRequests.id, reportId) )
                .returning();
            if (!result) {
                throw new Error('No rows returned from storeReport');
            }
            return result[0];
        } catch (error) {
            logger.error('Error storing report:', error);
            throw new Error(`Failed to store report: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};

export default reportModel;