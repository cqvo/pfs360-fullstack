import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('lib/database/index.ts: DATABASE_URL is not set');
const client = neon(DATABASE_URL);
const db = drizzle(client, { schema });

export default db;