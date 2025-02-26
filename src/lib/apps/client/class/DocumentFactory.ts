import { connectToDatabase } from '$lib/server/mongodb';
import { ObjectId, type WithId, type Document } from 'mongodb';
import type IDocument from '$lib/apps/client/type/IDocument';
import type ILink from '$lib/apps/client/type/ILink';
import type { LinkTokenCreateRequest } from 'plaid';
import plaid from '$lib/server/plaid';
import { VERCEL_BRANCH_URL, VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL } from '$env/static/private';

export abstract class DocumentFactory implements IDocument {
	abstract _id: ObjectId;
	abstract _collection: string;
	abstract createdAt: Date;
	abstract updatedAt: Date;

	// Each subclass should implement these static methods.
	static collectionName(): string {
		throw new Error('collectionName() must be implemented in the subclass');
	}
	static fromRecord(record: WithId<Document>) {
		throw new Error('fromRecord() must be implemented in the subclass');
	}
	static webhookUrl(): string {
		return VERCEL_ENV === 'production' ? `https://${VERCEL_PROJECT_PRODUCTION_URL}/api/v1/webhook` : `https://${VERCEL_BRANCH_URL}/api/v1/webhook`;
	}

	pojo() {
		return { ...this };
	}
	static async getCollection() {
		const { db } = await connectToDatabase();
		if (!db) throw new Error('getCollection: No database connection');
		return db.collection(this.collectionName());
	}
	static async findOne(filter: Record<string, string | ObjectId | Date | number>) {
		const collection = await this.getCollection();
		return await collection.findOne(filter);
	}
	static async updateOne(
		filter: Record<string, string | ObjectId | Date | number>,
		updateDocument: Record<string, string | Date | number>
	) {
		const collection = await this.getCollection();
		return await collection.updateOne(filter, updateDocument);
	}

	static async findById(id: ObjectId) {
		const filter = { _id: id };
		const record = await this.findOne(filter);
		if (!record) throw new Error(`${this.name} findById: Record not found`);
		return this.fromRecord(record);
	}

	static async updateById(id: ObjectId, updateDocument: Record<string, string | Date | number>) {
		const filter = { _id: id };
		const result = await this.updateOne(filter, updateDocument);
		if (!result.acknowledged) throw new Error(`${this.name} updateById: Write unacknowledged`);
		return result;
	}

	static async findByProperty(props: Record<string, string | ObjectId | Date | number>) {
		const record = await this.findOne(props);
		if (!record) throw new Error(`${this.name} findById: Record not found`);
		return this.fromRecord(record);
	}

	static async findAll() {
		const collection = await this.getCollection();
		const records = await collection.find({}).toArray();
		return records.map((record) => this.fromRecord(record));
	}
}