import "dotenv/config";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "../../env/server";
// biome-ignore lint/performance/noNamespaceImport: Required for Drizzle schema configuration
import * as schema from "./schema";

// Validate required environment variable
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is required");
}

// Create Bun SQL client
export const client = new SQL({
	url: env.DATABASE_URL,
	max: 10, // pool size: tune per plan
	idleTimeout: 30, // seconds
	maxLifetime: 3600, // seconds (optional)
	connectionTimeout: 10, // seconds
});

// Create Drizzle instance
export const db = drizzle({ client, schema });

export type DatabaseType = typeof db;
