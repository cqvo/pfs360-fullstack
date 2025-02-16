import service from '$lib/apps/reports/service';
import model from '$lib/apps/reports/model';
import plaid from '$lib/server/plaid';

const reportController = {
    newReportRequest: async (clientId:number, itemId:number, daysRequested:number) => {
        try {
            const options = await service.constructNewReportOptions(clientId);
            const accessToken = await model.retrieveAccessToken(itemId);
            const request = {
                access_tokens: [ accessToken ],
                days_requested: daysRequested,
                options,
            };
            const response = await plaid.assetReportCreate(request);
            const { 'asset_report_id': assetReportId, 'asset_report_token': assetReportToken, 'request_id': requestId } = response.data;
            const reportRequest = await model.createNewReportRequest(assetReportId, assetReportToken, clientId, requestId, daysRequested);
            return reportRequest;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to retrieve most recent link request');
        }
    },
    productReady: async (payload) => {
        try {
            const { 'asset_report_id': assetReportId } = payload;
            const report = await model.retrieveReportById(assetReportId);
            const request = {
                asset_report_token: report.reportToken,
            }
            const response = await plaid.assetReportGet(request);
            const reports = await service.processReportGetResponse(response);
            const storedReport = await model.storeReport(report.id, response.data.report);
            return storedReport;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update report request');
        }
    },
    retrieveReportByItemId: async (itemId: number) => {
        try {

        } catch (error) {
            console.error(error);
            throw new Error('Failed to update report request');
        }
    },
}

export default reportController;