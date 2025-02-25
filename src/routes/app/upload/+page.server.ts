import type { Actions } from '../../../../.svelte-kit/types/src/routes';
import { fail } from '@sveltejs/kit';
import TaxdomeRecord from '$lib/apps/client/class/TaxdomeRecord';

export const actions = {
	uploadCsv: async ({ request }) => {
		try {
			console.log('Received uploadCsv POST');
			const formData = await request.formData();
			const file = formData.get('fileToUpload') as File;
			console.log('Received file:', file?.name);
			console.log('formData', formData);
			if (!file || !file.name || file.name === 'undefined') {
				return fail(400, {
					error: true,
					message: 'You must provide a file to upload'
				});
			}
			TaxdomeRecord.processCsv(file).catch((err) => {
				console.error('Error processing CSV in background:', err);
			});
			return { success: true};
		} catch (error) {
			console.error('Error processing file:', error);
			return fail(500, {
				error: true,
				message: 'Error processing file'
			});
		}
	}
} satisfies Actions;
