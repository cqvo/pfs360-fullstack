import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { DATABASE_URL } from '$lib/config';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = neon(DATABASE_URL);
const db = drizzle(client, { schema });

export default db;