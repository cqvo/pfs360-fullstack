import type { ObjectId } from 'mongodb';

export default interface IDocument {
	_id: ObjectId | string;
	_collection: string;
	createdAt: Date;
	updatedAt: Date;
}