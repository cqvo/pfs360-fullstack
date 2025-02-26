import model from '$lib/apps/reports/model';
import { VERCEL_BRANCH_URL, VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL } from '$env/static/private';
const	WEBHOOK_URL =
  VERCEL_ENV === 'production' ? `https://${VERCEL_PROJECT_PRODUCTION_URL}/api/v1/webhook` : `https://${VERCEL_BRANCH_URL}/api/v1/webhook`;


const todayYYYYMMDD = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};
const lastMonthMMYY = () => {
    const date = new Date();
    const lastMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    return `${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}${String(lastMonthDate.getFullYear()).slice(-2)}`;
};

const reportService = {
    constructNewReportOptions: async (clientId: number) => {
        const client = await model.retrieveClientById(clientId);
        const clientReportId = `${client.taxdomeId}${lastMonthMMYY()}-${todayYYYYMMDD()}`;
        return {
            client_report_id: clientReportId,
            webhook: WEBHOOK_URL,
            user: {
                client_user_id: client.taxdomeId,
                email: client.emailAddress,
            }
        }
    },
};

export default reportService;