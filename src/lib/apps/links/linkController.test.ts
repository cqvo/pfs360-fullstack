import { describe, it, expect, vi, beforeEach } from 'vitest';
import linkController from './linkController';
import service from '$lib/apps/links/linkService';
import model from '$lib/apps/links/linkModel';
import plaid from '$lib/server/plaid';
import logger from '$lib/logger';

vi.mock('$lib/apps/links/linkService');
vi.mock('$lib/apps/links/linkModel');
vi.mock('$lib/server/plaid');
vi.mock('$lib/logger');

beforeEach(() => {
    vi.clearAllMocks();
  });
  
describe('linkController.newLinkCreateRequest', () => {
  it('should create a new link request successfully', async () => {
    // Arrange
    const clientId = 1;
    const mockRequest = {
      user: {
        client_user_id: clientId.toString(),
        email_address: 'test@gmail.com',
      },
      products: ['assets'],
      client_name: 'MockClientName',
      country_codes: ['US'],
      webhook: 'https://example.com/webhook',
      hosted_link: {
        delivery_method: 'email',
      },
    };
    const mockResponse = {
      data: {
        link_token: 'link-sandbox-af1a0311-da53-4636-b754-dd15cc058176',
        expiration: '2020-03-27T12:56:34Z',
        request_id: 'XQVgFigpGHXkb0b',
      },
    };
    const expectedLinkRequest = {
      clientId: clientId,
      linkToken: mockResponse.data.link_token,
      expiration: new Date(mockResponse.data.expiration),
      requestId: mockResponse.data.request_id,
    };
    const expectedLink = { id: 1, ...expectedLinkRequest };

    service.constructLinkCreateRequest.mockResolvedValueOnce(mockRequest);
    plaid.linkTokenCreate.mockResolvedValueOnce(mockResponse);
    model.insertNewLinkRequest.mockResolvedValueOnce(expectedLink);

    // Act
    const result = await linkController.newLinkCreateRequest(clientId);

    // Assert
    expect(service.constructLinkCreateRequest).toHaveBeenCalledWith(clientId);
    expect(plaid.linkTokenCreate).toHaveBeenCalledWith(mockRequest);
    expect(model.insertNewLinkRequest).toHaveBeenCalledWith(expectedLinkRequest);
    expect(result).toEqual(expectedLink);
  });
  it('should log an error and throw if plaid.linkTokenCreate fails', async () => {
    // Arrange
    const clientId = 1;
    const mockError = new Error('Plaid API error');
    plaid.linkTokenCreate.mockRejectedValueOnce(mockError);
  
    // Act & Assert
    await expect(linkController.newLinkCreateRequest(clientId)).rejects.toThrow('Failed to create a new link request');
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});
