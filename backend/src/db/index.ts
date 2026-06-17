import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg'

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
    console.error("DATABASE_URL is missing in .env file");
    process.exit(1);
}

const pool = new pg.Pool({
    connectionString
});

const db = drizzle(pool);

export default db;

