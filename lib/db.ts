import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy initialization to avoid errors during build time
let _db: NeonHttpDatabase<typeof schema> | null = null;

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    if (!_db) {
      if (!process.env.POSTGRES_URL) {
        throw new Error('POSTGRES_URL environment variable is not set');
      }
      const sql = neon(process.env.POSTGRES_URL);
      _db = drizzle(sql, { schema });
    }
    return (_db as any)[prop];
  },
});
