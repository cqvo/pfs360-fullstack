import { connectToDatabase } from '$lib/server/mongodb';
import type { WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { Status } from '$lib/constants';
import type { AxiosResponse } from 'npm:axios@1.7.7';
import type { LinkTokenCreateRequest, Products } from 'plaid';
import { encrypt, decrypt } from '$lib/server/crypto';

export class Client {
	id!: string;
	taxdomeId!: string;
	companyName!: string;
	emailAddress!: string;
	links?: App.Link[];
	items?: App.Item[];

	constructor(record: WithId<App.ClientRecord>) {
		this.id = record._id.toString();
		this.taxdomeId = record.taxdomeId;
		this.companyName = record.companyName;
		this.emailAddress = record.emailAddress;
		this.links = record.links;
		this.items = record.items;
	}

	latestValidLink(): string | undefined {
		if (!this.links || this.links.length === 0) return undefined;
		const latest = this.links[this.links.length - 1];
		if (latest.expiration < new Date() || latest.status !== Status.Pending) return undefined;
		return latest.linkToken;
	}

	oid(): ObjectId {
		return new ObjectId(this.id);
	}
}

export class Item implements App.Item {
	id: string;
	accessToken: string;
	institutionId: string;
	institutionName: string;
	status: Status;
	products: Products[];
	accounts: App.Account[];
	webhook: string;
	updateType: string;
	createdAt: Date;
	updatedAt: Date;
	consentExpiration: Date;

	constructor(data: Record<string, any>, metadata: Record<string, any>, accessToken: string) {
		const source = data?.data?.item ?? data;
		this.id = source['item_id'];
		this.accessToken = accessToken;
		this.institutionId = source['institution_id'];
		this.institutionName = source['institution_name'];
		this.status = Status.Active;
		this.products = source['products'];
		this.accounts = metadata['accounts'];
		this.webhook = source['webhook'];
		this.updateType = source['update_type'];
		this.createdAt = new Date(source['created_at']);
		this.updatedAt = new Date(source['created_at']);
		this.consentExpiration = new Date(source['consent_expiration_time']);
	}

	pojo() {
		return { ...this };
	}
	static fromObject(obj: Partial<Item>): Item {
		return Object.assign(new Item({}, {}, ''), obj);
	}
}

const clientModel = {
	upsertClients: async (clients: App.TaxdomeRecord[]) => {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const operations = clients.map((client) => ({
			updateOne: {
				filter: {
					taxdomeId: client.taxdomeId
				},
				update: {
					$set: {
						companyName: client.companyName,
						emailAddress: client.emailAddress
					},
					$setOnInsert: {
						taxdomeId: client.taxdomeId
					}
				},
				upsert: true
			}
		}));
		return await collection.bulkWrite(operations);
	},
	findClients: async () => {
		const { db } = await connectToDatabase();
		const collection = db.collection<App.ClientRecord>('clients');
		const clients = await collection.find().toArray();
		return clients.map((client) => new Client(client));
	},
	findClient: async (clientId: string) => {
		const { db } = await connectToDatabase();
		const collection = db.collection<App.ClientRecord>('clients');
		const client = await collection.findOne({
			_id: new ObjectId(clientId)
		});
		if (!client) throw new Error('Client not found');
		return new Client(client);
	},
	findItem: async (itemId: string) => {
		const { db } = await connectToDatabase();
		const collection = db.collection<App.ClientRecord>('clients');
		const client = await collection.findOne(
			{
				'items.id': itemId,
			},
			{
				projection: { _id: 0, companyName: 1, "items.$": 1 }
			});
		if (!client) throw new Error('Client not found');
		if (!client.items) throw new Error('Client Item not found');
		const item = Item.fromObject(client.items[0]);
		return {
			companyName: client.companyName,
			item: item
		};
	},
	newLinkResponse: async (clientId: string, response: AxiosResponse<LinkTokenCreateRequest>) => {
		if (!response) {
			throw new Error('plaid.linkTokenCreate response is undefined or null');
		}
		const { db } = await connectToDatabase();
		const collection = db.collection<App.ClientRecord>('clients');
		const filter = { _id: new ObjectId(clientId) };
		const updateDocument = {
			$push: {
				links: {
					linkToken: response.data['link_token'],
					expiration: new Date(response.data['expiration']),
					requestId: response.data['request_id'],
					createdAt: new Date(),
					status: Status.Pending
				}
			}
		};
		const result = await collection.updateOne(filter, updateDocument);
		if (result.modifiedCount === 0) {
			throw new Error('No document was updated');
		}
		return result;
	},
	updateLink: async (linkToken: string) => {
		const { db } = await connectToDatabase();
		const collection = db.collection<App.ClientRecord>('clients');
		const filter = { 'links.linkToken': linkToken };
		const updateDocument = {
			$set: { 'links.$.status': Status.Completed }
		};
		const result = await collection.updateOne(filter, updateDocument);
		if (result.modifiedCount === 0) {
			throw new Error('No document was updated');
		}
		return result;
	},
	insertItem: async (clientId: string, item) => {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		return await collection.updateOne({ _id: new ObjectId(clientId) }, { $push: { items: item } });
	}
};

export default clientModel;