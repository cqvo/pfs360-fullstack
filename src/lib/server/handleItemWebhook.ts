/**
 * @file Defines the handler for Item webhooks.
 * https://plaid.com/docs/#item-webhooks
 */

import { updateItemStatus, retrieveItemByPlaidItemId } from '$lib/server/database/queries/items';

interface PlaidItemWebhook {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
  error: {
    error_type: string;
    error_code: string;
    error_code_reason: string;
    error_message: string;
    display_message: string;
    request_id: string;
    causes: Array<any>;
    status: number;
    documentation_url: string;
    suggested_action: string;
  };
  environment: string;
}

/**
 * Handles Item errors received from item webhooks. When an error is received
 * different operations are needed to update an item based on the the error_code
 * that is encountered.
 *
 * @param {string} plaidItemId the Plaid ID of an item.
 * @param {Object} error the error received from the webhook.
 */

const itemErrorHandler = async (plaidItemId: string, error: PlaidItemWebhook['error']) => {
  const { error_code: errorCode } = error;
  switch (errorCode) {
    case 'ITEM_LOGIN_REQUIRED': {
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      await updateItemStatus(itemId.toString(), 'bad');
      break;
    }
    default:
      console.log(
        `WEBHOOK: ITEMS: Plaid item id ${plaidItemId}: unhandled ITEM error`
      );
  }
};

/**
 * Handles all Item webhook events.
 *
 * @param {Object} requestBody the request body of an incoming webhook event.
 * @param {Object} io a socket.io server instance.
 */
export const itemsHandler = async (requestBody: PlaidItemWebhook) => {
  console.log('WEBHOOK: ITEMS:', { requestBody });
  const {
    webhook_code: webhookCode,
    item_id: plaidItemId,
    error,
  } = requestBody;

  switch (webhookCode) {
    case 'ERROR':
    case 'LOGIN_REPAIRED':
    case 'PENDING_DISCONNECT':
    case 'PENDING_EXPIRATION':
    case 'USER_PERMISSION_REVOKED':
    case 'USER_ACCOUNT_REVOKED':
    case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
  }
}

// export const itemsHandler = async (requestBody: PlaidItemWebhook, io) => {
//   console.log('WEBHOOK: ITEMS:', { requestBody });
//   const {
//     webhook_code: webhookCode,
//     item_id: plaidItemId,
//     error,
//   }= requestBody;

//   const serverLogAndEmitSocket = (additionalInfo, itemId, errorCode) => {
//     console.log(
//       `WEBHOOK: ITEMS: ${webhookCode}: Plaid item id ${plaidItemId}: ${additionalInfo}`
//     );
//     // use websocket to notify the client that a webhook has been received and handled
//     if (webhookCode) io.emit(webhookCode, { itemId, errorCode });
//   };

//   switch (webhookCode) {
//     case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
//       serverLogAndEmitSocket('is updated', plaidItemId, error);
//       break;
//     case 'ERROR': {
//       itemErrorHandler(plaidItemId, error);
//       const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
//       serverLogAndEmitSocket(
//         `ERROR: ${error.error_code}: ${error.error_message}`,
//         itemId,
//         error.error_code
//       );
//       break;
//     }
//     case 'PENDING_EXPIRATION':
//     case 'PENDING_DISCONNECT': {
//       const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
//       await updateItemStatus(itemId.toString(), webhookCode);
//       serverLogAndEmitSocket(
//         `user needs to re-enter login credentials`,
//         itemId,
//         error
//       );
//       break;
//     }
//     default:
//       serverLogAndEmitSocket(
//         'unhandled webhook type received.',
//         plaidItemId,
//         error
//       );
//   }
// };