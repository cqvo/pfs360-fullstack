import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { MONGODB_URL } from '$lib/config';

let client: MongoClient;
let db: Db;

/**
 * Establishes a connection to the MongoDB database 'pfs'.
 * Ensures a single client instance is used across the app.
 */
export const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
	if (!client) {
		// Create a MongoClient with a MongoClientOptions object to set the Stable API version
		client = new MongoClient(MONGODB_URL, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
		await client.connect();
		db = client.db("pfs"); // Connect to the 'pfs' database
		console.log("✅ Connected to MongoDB (pfs)");
	}
	return { client, db };
};