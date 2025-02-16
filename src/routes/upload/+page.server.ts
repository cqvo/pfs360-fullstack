import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import clientController from '$lib/apps/client/controller';

export const actions = {
  default: async ({ request }: { request: Request }) => {
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
    await clientController.uploadClients(fileToUpload);
    } catch (error) {
      console.error('Error processing file:', error);
      return fail(500, {
        error: true,
        message: 'Error processing file'
      });
    }
  }
} satisfies Actions;