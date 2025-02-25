import { connectToDatabase } from '$lib/server/mongodb';
import bcrypt from 'bcrypt';

export default class User {
	email: string;
	pwHash: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(email: string, pwHash: string, createdAt?: Date, updatedAt?: Date) {
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
		return new User(result.email, result.pwHash, result.createdAt, result.updatedAt);
	}

	async comparePassword(password: string): Promise<boolean> {
		return bcrypt.compareSync(password, this.pwHash);
	}
}
