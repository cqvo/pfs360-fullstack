import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import clientController from '$lib/apps/client/controller';
import clientService from '$lib/apps/client/service';

export const actions = {
  uploadCsv: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());
      if (
        !(formData.fileToUpload as File).name ||
        (formData.fileToUpload as File).name === 'undefined'
      ) {
        return fail(400, {
          error: true,
          message: 'You must provide a file to upload'
        });
      }
    const { fileToUpload } = formData as { fileToUpload: File };
    await clientService.processTaxdomeCsv(fileToUpload);
    } catch (error) {
      console.error('Error processing file:', error);
      return fail(500, {
        error: true,
        message: 'Error processing file'
      });
    }
  }
} satisfies Actions;