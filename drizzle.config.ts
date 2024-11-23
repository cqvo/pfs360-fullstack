import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL) throw new Error('drizzle.config.ts: DATABASE_URL is not set');

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/server/database/schema.ts',
  introspect: { casing: 'camel' },
  dbCredentials: {
    url: process.env.DATABASE_URL
  },

  verbose: true,
  strict: true,
  dialect: 'postgresql'
});
