import { connectToDatabase } from '$lib/server/mongodb';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import type { Role } from '$lib/UserPermissions';

export default class User {
	readonly id: ObjectId;
	email: string;
	pwHash: string;
	createdAt: Date;
	updatedAt: Date;
	role: string;

	constructor(
		id: ObjectId,
		email: string,
		pwHash: string,
		role?: string,
		createdAt?: Date,
		updatedAt?: Date
	) {
		this.id = id;
		this.email = email;
		this.pwHash = pwHash;
		this.role = role || 'viewer';
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	static async findOne(email: string): Promise<User | null> {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const result = await collection.findOne({ email: email });
		if (!result) return null;
		console.log('User findOne result:', result);
		return new User(
			result._id,
			result.email,
			result.pwHash,
			result.role,
			result.createdAt,
			result.updatedAt
		);
	}

	static async findAll(): Promise<User[]> {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const results = await collection.find().toArray();
		return results.map(
			(result) =>
				new User(
					result._id,
					result.email,
					result.pwHash,
					result.role,
					result.createdAt,
					result.updatedAt
				)
		);
	}

	pojo() {
		return { ...this };
	}

	static async insertNew(email: string, password: string, role: Role) {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const now = new Date();
		const result = await collection.insertOne({
			email: email,
			pwHash: bcrypt.hashSync(password, 10),
			role: role,
			createdAt: now,
			updatedAt: now
		});
		if (!result.acknowledged) {
			throw new Error('Failed to insert new user.');
		}
		return {email: email, role: role, createdAt: now, updatedAt: now};
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

	static async delete(email: string) {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const result = await collection.deleteOne({ email: email });
		if (result.deletedCount !== 1) {
			throw new Error('Failed to delete user.');
		}
	}

	async updateRole(role: Role) {
		const { db } = await connectToDatabase();
		const collection = db.collection('users');
		const result = await collection.updateOne(
			{ _id: this.id },
			{
				$set: {
					role: role,
					updatedAt: new Date()
				}
			}
		);
		if (result.modifiedCount !== 1) {
			throw new Error('Failed to update role.');
		}
	}
}
