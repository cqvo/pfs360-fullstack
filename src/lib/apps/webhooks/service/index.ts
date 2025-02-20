const assetsWebhook = async (payload) => {
	console.log('Assets webhook:', payload);
}

const webhookService = {
	processWebhook: async (request) => {
		const payload = await request.json();
		if (payload['webhook_type'] === 'ASSETS') {
			await assetsWebhook(payload);
		}
	}
}
export default webhookService;