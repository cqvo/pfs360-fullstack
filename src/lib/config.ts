import logger from '$lib/logger';
import {
    DATABASE_URL as _DATABASE_URL,
    MONGODB_URI as _MONGODB_URL,
    ENCRYPTION_KEY as _ENCRYPTION_KEY,
    PLAID_CLIENT_ID as _PLAID_CLIENT_ID,
    PLAID_CLIENT_NAME as _PLAID_CLIENT_NAME,
    PLAID_EMAIL as _PLAID_EMAIL,
    PLAID_SECRET as _PLAID_SECRET,
    VERCEL_ENV as _VERCEL_ENV,
    VERCEL_PROJECT_PRODUCTION_URL as _VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_BRANCH_URL as _VERCEL_BRANCH_URL,
} from '$env/static/private';

export const DATABASE_URL = _DATABASE_URL;
export const MONGODB_URL = _MONGODB_URL;
export const ENCRYPTION_KEY = _ENCRYPTION_KEY;
export const PLAID_CLIENT_ID = _PLAID_CLIENT_ID;
export const PLAID_CLIENT_NAME = _PLAID_CLIENT_NAME || 'PFS 360';
export const PLAID_EMAIL = _PLAID_EMAIL;
export const PLAID_SECRET = _PLAID_SECRET;
export const VERCEL_ENV = _VERCEL_ENV || 'development';
export const VERCEL_PROJECT_PRODUCTION_URL = _VERCEL_PROJECT_PRODUCTION_URL;
export const VERCEL_BRANCH_URL = _VERCEL_BRANCH_URL;

const webhookRoute = '/api/v1/webhook';
const baseUrl = VERCEL_ENV === 'production' ? VERCEL_PROJECT_PRODUCTION_URL : VERCEL_BRANCH_URL;
export const WEBHOOK_URL = `https://${baseUrl}${webhookRoute}`;
console.log(`Using webhook URL: ${WEBHOOK_URL}`);