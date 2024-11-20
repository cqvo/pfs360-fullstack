import type { Actions } from './$types';
import { parse } from 'csv-parse/sync';
import { fail, type AwaitedActions } from '@sveltejs/kit';
import { upsertClient } from '$lib/server/database/queries/clients';

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
    console.log('File to upload:', fileToUpload);

    const content = await fileToUpload.text(); // Read file content
    const records = parse(content, { columns: ['taxdomeId', 'companyName', 'emailAddress'] }); // Parse CSV into JSON
    records.forEach((record: Record<string, any>) => {
        upsertClient(record);
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return fail(500, {
      error: true,
      message: 'Error processing file'
    });
  }
}
} satisfies Actions;