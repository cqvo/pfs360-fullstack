import { ObjectId, type Document, type WithId } from 'mongodb';
import type ILink from '$lib/apps/client/type/ILink';
import { CountryCode, type LinkTokenCreateRequest, Products } from 'plaid';
import { Plaid, webhookUrl } from '$lib/server/Plaid';
import { DocumentFactory } from '$lib/apps/client/class/DocumentFactory';
import { PLAID_CLIENT_NAME, PLAID_EMAIL } from '$env/static/private';

export default class Client extends DocumentFactory {
	_id: string;
	_collection: string = Client.collectionName();
	companyName: string;
	email: string;
	links: ILink[];
	items: string[];
	createdAt: Date;
	updatedAt: Date;

	static collectionName() {
		return 'clients';
	}

	constructor({ _id, companyName, email, links, items, createdAt, updatedAt }) {
		this._id: _id;
		this.companyName = companyName;
		this.email = email;
		this.links = links || [];
		this.items = items || [];
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	static fromTaxdomeCsv(row: Record<string, string>) {
		const props = {
			_id: row['taxdomeId'],
			companyName: row['companyName'],
			email: row['email']
		};
		return new Client(props);
	}

	static fromRecord(record: WithId<Document>) {
		const props = {
			_id: record['_id'],
			companyName: record['company_name'],
			email: record['email_address'],
			links: record['links'],
			items: record['items'],
			createdAt: record['created_at'],
			updatedAt: record['updated_at']
		};
		return new Client(props);
	}

	async findValidLink() {
		const now = new Date();
		for (const link of this.links) {
			if (link.expiration > now) return link;
			const updateDocument = {
				$pull: { links: { linkToken: link.linkToken } }
			};
			await Client.updateById(this._id, updateDocument);
		}
		return null;
	}

	async createNewLink() {
		const request: LinkTokenCreateRequest = {
			user: {
				client_user_id: this._id,
				email_address: PLAID_EMAIL || 'pfs@wumbo.tech'
			},
			client_name: PLAID_CLIENT_NAME || 'PFS360',
			products: [Products.Assets],
			country_codes: [CountryCode.Us],
			language: 'en',
			webhook: Client.webhookUrl()
		};
		const response = await Plaid.linkTokenCreate(request);
		if (!response || !response.data) throw new Error(`Client createNewLink: No response data`);
		const link: ILink = {
			linkToken: response.data['link_token'],
			requestId: response.data['request_id'],
			expiration: new Date(response.data['expiration'])
		};
		const updateDocument = { $push: { links: link } };
		await Client.updateById(this._id, updateDocument);
		return link;
	}

	async removeLink(link: ILink) {
		const updateDocument = { $pull: { links: { linkToken: link.linkToken } } };
		await Client.updateById(this._id, updateDocument);
	}
}