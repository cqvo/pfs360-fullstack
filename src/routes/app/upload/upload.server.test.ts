import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { actions } from './+page.server';
import TaxdomeRecord from '$lib/apps/client/class/TaxdomeRecord';
import { fail } from '@sveltejs/kit';

// Mock dependencies
vi.mock('$lib/server/LoggerFactory', () => ({
	createLogger: () => ({
		info: vi.fn(),
		error: vi.fn()
	})
}));

vi.mock('$lib/apps/client/class/TaxdomeRecord', () => ({
	default: {
		processCsv: vi.fn(),
		updateClientList: vi.fn()
	}
}));

describe('CSV Upload Functionality', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('uploadCsv action', () => {
		it('should return 400 error when no file is provided', async () => {
			// Arrange
			const request = {
				formData: vi.fn().mockResolvedValue(new FormData())
			};

			// Act
			const result = await actions.uploadCsv({ request } as any);

			// Assert
			expect(result).toEqual(
				fail(400, {
					error: true,
					message: 'You must provide a file to upload'
				})
			);
			expect(TaxdomeRecord.processCsv).not.toHaveBeenCalled();
		});

		it('should return 400 error when file name is undefined', async () => {
			// Arrange
			const formData = new FormData();
			const file = new File([], 'undefined');
			formData.append('fileToUpload', file);

			const request = {
				formData: vi.fn().mockResolvedValue(formData)
			};

			// Act
			const result = await actions.uploadCsv({ request } as any);

			// Assert
			expect(result).toEqual(
				fail(400, {
					error: true,
					message: 'You must provide a file to upload'
				})
			);
			expect(TaxdomeRecord.processCsv).not.toHaveBeenCalled();
		});

		it('should process the file and return success when valid file is uploaded', async () => {
			// Arrange
			const formData = new FormData();
			const file = new File(['taxdomeId,companyName,emailAddress\n1,Test Company,test@example.com'], 'test.csv');
			formData.append('fileToUpload', file);

			const request = {
				formData: vi.fn().mockResolvedValue(formData)
			};

			TaxdomeRecord.processCsv.mockResolvedValue({ processed: 1 });

			// Act
			const result = await actions.uploadCsv({ request } as any);

			// Assert
			expect(result).toEqual({ success: true });
			expect(TaxdomeRecord.processCsv).toHaveBeenCalledWith(file);
		});

		it('should return 500 error when processing fails', async () => {
			// Arrange
			const formData = new FormData();
			const file = new File(['invalid data'], 'test.csv');
			formData.append('fileToUpload', file);

			const request = {
				formData: vi.fn().mockResolvedValue(formData)
			};

			const error = new Error('Processing failed');
			TaxdomeRecord.processCsv.mockRejectedValue(error);

			// Act
			const result = await actions.uploadCsv({ request } as any);

			// Assert
			expect(result).toEqual(fail(500, error));
		});
	});
});