import './env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema'; // Import your schema

const connectionString = process.env.DATABASE_URL as string;
const client = postgres(connectionString);

// Pass the schema here to enable Relational Queries
export const db = drizzle(client, { schema });