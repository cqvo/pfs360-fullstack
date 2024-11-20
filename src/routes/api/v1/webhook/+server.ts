import { itemsHandler } from '$lib/server/handleItemWebhook';

export const POST = async ({ request }) => {
    try {
        const payload = await request.json(); // Parse the incoming JSON data
        console.log('Webhook received:', payload);

        // Handle the webhook logic here
        switch (payload['webhook_type']) {
        case 'ITEM':{
            await itemsHandler(payload);
            break;
        }
        case 'LINK': {
            // Handle LINK webhook
        }
        case 'ASSETS': {
            // Handle ASSETS webhook
        }
        default: {
            console.log('WEBHOOK: unhandled webhook type');
        }
        }
        return new Response('Webhook received', { status: 200 });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return new Response('Error processing webhook', { status: 500 });
    }
}