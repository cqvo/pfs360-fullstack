import { connectToDatabase } from '$lib/server/Mongodb';
import type { LinkTokenCreateRequest } from 'plaid';
import { CountryCode, Products } from 'plaid';
import {
	PLAID_CLIENT_NAME,
	PLAID_EMAIL, VERCEL_BRANCH_URL,
	VERCEL_ENV,
	VERCEL_PROJECT_PRODUCTION_URL
} from '$env/static/private';
import plaid from '$lib/server/Plaid';
import Client from '$lib/apps/client/class/Client';
import { ObjectId } from 'mongodb';

const	WEBHOOK_URL =
	VERCEL_ENV === 'production' ? `https://${VERCEL_PROJECT_PRODUCTION_URL}/api/v1/webhook` : `https://${VERCEL_BRANCH_URL}/api/v1/webhook`;


export default class Link {
	linkToken: string;
	requestId: string;
	expiration: Date;

	constructor(linkToken: string, requestId: string, expiration: Date) {
		this.linkToken = linkToken;
		this.requestId = requestId;
		this.expiration = expiration;
	}

	static constructCreateRequest(client: Client): LinkTokenCreateRequest {
		return {
			'user': {
				'client_user_id': client.taxdomeId,
				'email_address': PLAID_EMAIL || 'pfs@wumbo.tech',
			},
			'client_name': PLAID_CLIENT_NAME || 'PFS360',
			'products': [Products.Assets],
			'country_codes': [CountryCode.Us],
			'language': 'en',
			'webhook': WEBHOOK_URL,
		}
	}

	static async createNewToken(request: LinkTokenCreateRequest) {
		const response = await plaid.linkTokenCreate(request);
		if (!response || !response.data) {
			throw new Error('Failed to create link token');
		}
		console.log('Creating new link token:', response.data);
		return new Link(
			response.data['link_token'],
			response.data['request_id'],
			new Date(response.data['expiration']));
	}

	async addToClient(client: Client) {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const filter = { _id: new ObjectId(client.clientId) };
		const updateDocument = {
			$push: {
				links: {
					'link_token': this.linkToken,
					'expiration': this.expiration,
					'request_id': this.requestId,
				}
			}
		};

		return await collection.updateOne(filter, updateDocument);
	}

	async removeFromClient(client: Client) {
		const { db } = await connectToDatabase();
		const collection = db.collection('clients');
		const filter = { _id: new ObjectId(client.clientId) };
		const updateDocument = {
			$pull: { links: { linkToken: this.linkToken } }
		}
		return await collection.updateOne(filter, updateDocument);
	}
}
