import { connectToDatabase } from '$lib/server/Mongodb';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

export default class User {
	private readonly id: ObjectId;
	email: string;
	pwHash: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(id: ObjectId, email: string, pwHash: string, createdAt?: Date, updatedAt?: Date) {
		this.id = id;
		this.email = email;
		this.pwHash = pwHash;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	static async findOne(email: string): Promise<User | null> {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const result = await collection.findOne({ email: email });
		if (!result) return null;
		console.log('User findOne result:', result);
		return new User(result._id, result.email, result.pwHash, result.createdAt, result.updatedAt);
	}

	static async insertNew(email, pwHash) {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const result = await collection.insertOne({
			email: email,
			pwHash: pwHash,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		if (!result.acknowledged) {
			throw new Error('Failed to insert new user.');
		}
		return new User(result.insertedId, email, pwHash);
	}

	async comparePassword(password: string): Promise<boolean> {
		return bcrypt.compareSync(password, this.pwHash);
	}

	async updatePassword(newPassword: string) {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const result = await collection.updateOne(
			{ _id: this.id },
			{
				$set: {
					pwHash: bcrypt.hashSync(newPassword, 10),
					updatedAt: new Date()
				}
			}
		);
		if (result.modifiedCount !== 1) {
			throw new Error('Failed to update password.');
		}
	}
}
