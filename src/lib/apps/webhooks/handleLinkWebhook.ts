/**
 * @file Defines the handler for Link webhooks.
 * https://plaid.com/docs/#item-webhooks
 */

import { updateItemStatus, retrieveItemByPlaidItemId } from '$lib/server/database/queries/items';

interface BaseWebhookRequest {
  webhook_type: string;
  webhook_code: string;
  link_session_id: string;
  link_token: string;
}

interface EnvironmentRequest extends BaseWebhookRequest {
  environment: string;
}

interface ItemAddResultRequest extends EnvironmentRequest {
  public_token: string;
}

interface EventsRequest extends BaseWebhookRequest {
  events: Array<{
    event_name: string;
    timestamp: string;
    event_id: string;
    event_metadata: {
      error_code: string;
      error_message: string;
      error_type: string;
      exit_status: string;
      institution_id: string;
      institution_name: string;
      institution_search_query: string;
      request_id: string;
      mfa_type: string;
      view_name: string;
      selection: string;
      brand_name: string;
      match_reason: string;
      routing_number: string;
      account_number_mask: string;
    };
  }>;
}

interface SessionFinishedRequest extends EnvironmentRequest {
  status: string;
  public_tokens: Array<string>;
}

export const linkHandler = async (payload: Record<string, any>) => {
  // console.log('WEBHOOK: LINKS:', { requestBody });
  switch (payload['webhook_code']) {
    case 'ITEM_ADD_RESULT':
    case 'EVENTS':
    case 'SESSION_FINISHED':
    default:
  }
}

export default linkHandler;