import linkController from '$lib/apps/links/linkController';
import reportController from '$lib/apps/reports/controller';

const webhookController = async (request: Request) => {
    const payload = await request.json();
    const type = payload['webhook_type'];
    const code = payload['webhook_code'];
    if (type === 'LINK') {
        console.log('WEBHOOK: unhandled LINK webhook code');
    }
    if (type === 'ITEM') {
        // Handle ITEM webhook
        console.log('WEBHOOK: unhandled ITEM webhook code');
    }
    if (type === 'ASSETS') {
        if (code === 'PRODUCT_READY') {
            console.log('WEBHOOK: PRODUCT_READY');
            reportController.productReady(payload);
        }
        else {
            console.log('WEBHOOK: unhandled ASSETS webhook code');
        }
    }
    else {
        console.log('WEBHOOK: unhandled webhook type');
    }
};

export default webhookController;