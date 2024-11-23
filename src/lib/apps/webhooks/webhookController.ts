import linkController from '$lib/apps/links/linkController';

const webhookController = async (request: Request) => {
    const payload = await request.json();
    const type = payload['webhook_type'];
    const code = payload['webhook_code'];
    if (type === 'LINK') {
        if (code === 'ITEM_ADD_RESULT') linkController.itemAddResult(payload);
        else console.log('WEBHOOK: unhandled LINK webhook code');
    }
    if (type === 'ITEM') {
        // Handle ITEM webhook
        console.log('WEBHOOK: unhandled ITEM webhook code');
    }
    else {
        console.log('WEBHOOK: unhandled webhook type');
    }
};

export default webhookController;