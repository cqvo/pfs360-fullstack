import Report from '$lib/apps/client/class/Report';

export const POST = async ({ request }) => {
    try {
        const body = await request.json();
        const webhookType = body['webhook_type'];
        const webhookCode = body['webhook_code'];
        console.log('Received webhook:', body);
        if (webhookType === 'ASSETS' && webhookCode === 'PRODUCT_READY') {
            const report = await Report.findOne(body['asset_report_id']);
            await report.updateReport();
            const accounts = report.getAccounts();
            await Promise.all(accounts.map(account => account.upsertHistoricalBalances()));
            return new Response('Webhook received', { status: 200 });
        }
        return new Response('Webhook received but not handled', { status: 200 });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return new Response('Error processing webhook', { status: 500 });
    }
}