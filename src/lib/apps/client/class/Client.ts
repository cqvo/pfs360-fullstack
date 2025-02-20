import { connectToDatabase } from '$lib/server/mongodb';
import TaxdomeRecord from '$lib/apps/client/class/TaxdomeRecord';
import Link from '$lib/apps/client/class/Link';
import Item from '$lib/apps/client/class/Item';
import { ObjectId } from 'mongodb';

export default class Client extends TaxdomeRecord {
	clientId: string;
	links: Link[];
	items: Item[];
	createdAt: Date;
	updatedAt: Date;

	constructor (id: string, taxdomeId: string, name: string, email: string, links: Link[], items: Item[], createdAt?: Date, updatedAt?: Date) {
		super(taxdomeId, name, email);
		this.clientId = id;
		this.links = links;
		this.items = items;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	static async findOne(clientId: string) {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const record = await collection.findOne({
			_id: new ObjectId(clientId)
		});
		if (!record) throw new Error('Client findOne: Client not found');
		return new Client(record._id.toString(), record.taxdome_id, record.company_name, record.email, record.links, record.items, record.created_at, record.updated_at);
	}

	async findValidLink () {
		const now = new Date();
		// const link = this.links.find(link => link.expiration > now);
		const links = this.links.map(linkData => new Link(
			linkData.linkToken,
			linkData.requestId,
			linkData.expiration
		));
		for (const link of links) {
			if (link.expiration > now) {
				return link;
			}
			await link.removeFromClient(this);
		}
		return null;
	}

	async addLink(link: Link) {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const filter = { _id: new ObjectId(this.clientId) };
		const updateDocument = {
			$push: {
				links: {
					'link_token': link.linkToken,
					'expiration': link.expiration,
					'request_id': link.requestId,
				}
			}
		};
		const result = await collection.updateOne(filter, updateDocument);
		console.log('Added link result', result);
	}

	async removeLink(link: Link) {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const filter = { _id: new ObjectId(this.clientId) };
		const updateDocument = {
			$pull: { links: { linkToken: link.linkToken } }
		}
		const result = await collection.updateOne(filter, updateDocument);
		console.log('Removed link result', result);
	}

	async upsertItem(item: Item) {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const updateResult = await collection.updateOne(
			{ _id: new ObjectId(this.clientId), "items.itemId": item.itemId },
			{ $set: { "items.$": item } }
		);
		if (updateResult.modifiedCount === 0) {
			const result = await collection.updateOne(
				{ _id: new ObjectId(this.clientId) },
				{ $push: { items: item } }
			);
			console.log('Client upsertItem', result);
			return result;
		}
		return updateResult;
	}
}