import { connectToDatabase } from '$lib/server/Mongodb';
import { ObjectId, type WithId, type Document } from 'mongodb';
import type IDocument from '$lib/apps/client/type/IDocument';
import type ILink from '$lib/apps/client/type/ILink';
import type { LinkTokenCreateRequest } from 'plaid';
import plaid from '$lib/server/Plaid';
import { VERCEL_BRANCH_URL, VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL } from '$env/static/private';

export abstract class DocumentFactory {
	abstract _id: ObjectId | string;
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

	static async findById(id: ObjectId | string) {
		const filter = { _id: id };
		const record = await this.findOne(filter);
		if (!record) throw new Error(`${this.name} findById: Record not found`);
		return this.fromRecord(record);
	}

	static async updateOne(
		filter: Record<string, string | ObjectId | Date | number>,
		updateDocument: Record<string, string | Date | number>,
		options?: Record<string, string | boolean>
	) {
		const collection = await this.getCollection();
		return await collection.updateOne(filter, updateDocument, options);
	}
	static async updateById(
		id: ObjectId | string,
		updateDocument: Record<string, string | Date | number>,
		options?: Record<string, string | boolean>
	) {
		const filter = { _id: id };
		const result = await this.updateOne(filter, updateDocument, options);
		if (!result.acknowledged) throw new Error(`${this.name} updateById: Write unacknowledged`);
		return result;
	}
}
