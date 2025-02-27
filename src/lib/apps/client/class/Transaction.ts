import { DocumentFactory } from '$lib/apps/client/class/DocumentFactory';
import type { Document, WithId } from 'mongodb';

export default class Transaction extends DocumentFactory {
	_id: string;
	_collection: string = Transaction.collectionName();
	accountId: string;
	date: Date;
	amount: number;
	currencyCode: string;
	description: string;
	pending: boolean;
	createdAt: Date = new Date();
	updatedAt: Date = new Date();

	constructor({ _id, accountId, date, amount, currencyCode, description, pending, createdAt, updatedAt }) {
		super();
		this._id = _id;
		this.accountId = accountId;
		this.date = date;
		this.amount = amount;
		this.currencyCode = currencyCode;
		this.description = description;
		this.pending = pending;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	static collectionName() {
		return 'transactions';
	}

	static fromRecord(record: WithId<Document>) {
		const props = {
			_id: record['_id'],
			accountId: record['account_id'],
			date: record['date'],
			amount: record['amount'],
			currencyCode: record['currency_code'],
			description: record['description'],
			pending: record['pending'],
			createdAt: record['created_at'],
			updatedAt: record['updated_at']
		}
		return new Transaction(props);
	}

	static fromAssetReport() {
		// Implement this method
	}
}