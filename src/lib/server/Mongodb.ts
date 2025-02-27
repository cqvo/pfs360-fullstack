import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';
import { createLogger } from '$lib/server/Logger';

const logger = createLogger({ component: '$lib/server/Mongodb' });

let client: MongoClient;
let db: Db;

/**
 * Establishes a connection to the MongoDB database 'pfs'.
 * Ensures a single client instance is used across the app.
 */
const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
};

export const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
	if (!client) {
		// Create a MongoClient with a MongoClientOptions object to set the Stable API version
		client = new MongoClient(MONGODB_URI, options);
		await client.connect();
		db = client.db('pfs'); // Connect to the 'pfs' database
		logger.info('Connected to MongoDB:', db.databaseName);

		const collections = ['clients', 'accounts', 'reports', 'users'];
		const existingCollections = await db.listCollections().toArray();
		const existingCollectionNames = existingCollections.map((col) => col.name);
		for (const collection of collections) {
			if (!existingCollectionNames.includes(collection)) {
				await db.createCollection(collection);
				logger.info(`Created collection: ${collection}`);
			}
		}
	}
	return { client, db };
};