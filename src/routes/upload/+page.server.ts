import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import clientController from '$lib/apps/clients/controller';

export const actions = {
  uploadFile: async ({ request }: { request: Request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());
      const { fileToUpload } = formData as { fileToUpload: File };
      if (!fileToUpload || fileToUpload.name === 'undefined') {
        return {
          success: false,
          message: 'You must provide a file to upload'
        };
      }
      console.log('Received file:', fileToUpload.name);
      await clientController.uploadClients(fileToUpload);
      return {
        success: true,
        message: 'File uploaded successfully'
      };
    } catch (error) {
      console.error('Error processing file:', error);
      return  {
        success: false,
        message: 'Error processing file'
      };
    }
  }
} satisfies Actions;