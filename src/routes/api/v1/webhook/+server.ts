import webhookController from '$lib/apps/webhooks/webhookController';

export const POST = async ({ request }) => {
    try {
        await webhookController(request);
        return new Response('Webhook received', { status: 200 });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return new Response('Error processing webhook', { status: 500 });
    }
}