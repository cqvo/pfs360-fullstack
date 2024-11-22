import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import * as schema from '$lib/server/database/schema';
import { env } from '$env/dynamic/private';

export const GET = async () => {
    const clientId = 2;
    const sql = neon(env.DATABASE_URL);
    const db = drizzle(sql);
};