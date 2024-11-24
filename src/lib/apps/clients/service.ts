import logger from '$lib/logger';
import { parse } from 'csv-parse/sync';

interface ClientRecord {
    taxdomeId: string;
    companyName: string;
    emailAddress: string;
}

const clientService = {
    processClientsCsv: async (file: File) => {
        try {
            const content = await file.text();
            const records: Array<ClientRecord> = parse(content, { columns: ['taxdomeId', 'companyName', 'emailAddress'] });
            if (!records || records.length === 0) {
                throw new Error('No records found in CSV');
            }
            return records;
        } catch (error) {
            logger.error(error);
            throw new Error(`Failed to process clients CSV: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};

export default clientService;