import { fail, type Actions } from '@sveltejs/kit';
import TaxdomeRecord from '$lib/apps/client/class/TaxdomeRecord';
import { createLogger } from '$lib/server/LoggerFactory';

const logger = createLogger({ component: '/routes/app/upload/+page.server.ts' });

export const actions = {
	uploadCsv: async ({ request }) => {
		try {
			const formData = await request.formData();
			const file = formData.get('fileToUpload') as File;
			if (!file || !file.name || file.name === 'undefined') {
				return fail(400, {
					error: true,
					message: 'You must provide a file to upload'
				});
			}
			logger.info('uploadCsv() Received file:', file.name);
			await TaxdomeRecord.processCsv(file);
			return { success: true };
		} catch (err) {
			logger.error('uploadCsv() Error:', err);
			return fail(500, err);
		}
	}
} satisfies Actions;
