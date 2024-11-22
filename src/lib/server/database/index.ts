import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const NEON_DEV_SHARD = 'postgresql://neondb_owner:Mzm18LVljbcP@ep-dawn-fog-a5o424gy.us-east-2.aws.neon.tech/neondb?sslmode=require';
const DATABASE_URL = Deno.env.get('DATABASE_URL') || NEON_DEV_SHARD;

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = neon(DATABASE_URL);
const db = drizzle(client, { schema });

export default db;