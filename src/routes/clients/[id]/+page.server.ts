import type { Actions, PageServerLoad } from './$types';
import linkModel from '$lib/apps/links/linkModel';
import linkController from '$lib/apps/links/linkController';
import clientController from '$lib/apps/clients/controller';
import reportController from '$lib/apps/reports/controller';

const reportStartDate = () => {
	const today = new Date();
	const date = new Date();
	date.setMonth(date.getMonth() - 1);
	date.setDate(0);
	return date;
};
const findLastMonth = () => {
    const today = new Date();
    const lastMonthIndex = today.getMonth() - 1;
    const lastMonthDate = new Date(today.getFullYear(), lastMonthIndex, 1);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[lastMonthDate.getMonth()];
};
const daysBetween = (startDate: Date, endDate: Date) => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	start.setHours(0, 0, 0, 0);
	end.setHours(0, 0, 0, 0);
	return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export const load: PageServerLoad = async ({ params }) => {
	const clientId = Number(params.id);
	const client = await linkModel.retrieveClientById(clientId);
	const items = await clientController.retrieveItemsByClientId(clientId);
	const lastMonth = findLastMonth();
	const daysRequested = daysBetween(reportStartDate(), new Date());
	return {
		items, client, clientId, lastMonth, daysRequested,
	};
}

export const actions = {
    newToken: async ({ request }) => {
        try {
            const data = await request.formData();
            const clientId = Number(data.get('clientId'));
            // console.log('Creating link token for client:', clientId);
            const linkRequest = await linkController.newLinkCreateRequest(clientId);
            // console.log({linkRequest});
            const linkToken = linkRequest.linkToken;
            console.log('Link token created:', linkToken);
            return {
                success: true,
                linkToken: linkToken,
            }
        } catch (error) {
            console.error('Error creating link token:', error);
            return {
                success: false,
                error: 'Failed to create link token',
            }
        }
    },
    onSuccess: async ({ request }) => {
        try {
            const data = await request.formData();
            const publicToken = data.get('publicToken');
            const linkToken = data.get('linkToken');
            const item = await linkController.webLinkOnSuccess({ linkToken, publicToken });
            return {
                success: true,
                item: item,
            }
        } catch (error) {
            console.error('Error processing onSuccess:', error);
        }
    },
	newReport: async ({ request }) => {
		try {
			const daysRequested = daysBetween(reportStartDate(), new Date())
			const data = await request.formData();
			const itemId = Number(data.get('itemId'));
			const clientId = Number(data.get('clientId'));
			const report = await reportController.newReportRequest(clientId, itemId, daysRequested);
			return {
				success: true,
				report: report,
			}
		} catch (error) {
			console.error('Error generating report:', error);
		}
	},
} satisfies Actions;