import { connectToDatabase } from '$lib/server/mongodb';
import type { ObjectId } from 'mongodb';

export abstract class Document {
	private _collection: string = '';
	private _id: ObjectId | null = null;
	public  save(): string;
	static async openCollection() {
		const { db } = await connectToDatabase();
		return db.collection(this._collection);
	};
	static async findById(id: ObjectId) {
		const collection = await this.openCollection();
	};
	static async findByProperty() {
		const collection = await this.openCollection();
	}
}

export class Client extends Document {
	public findById(): string {
		return 'Client.findById';
	}

	public findByProperty(): string {
		return 'Client.findByProperty';
	}

	public save(): string {
		return 'Client.save';
	}

	public openCollection(): string {
		return 'Client.openCollection';
	}
}