import { ObjectId, type Document, type WithId } from 'mongodb';
import type ILink from '$lib/apps/client/type/ILink';
import { CountryCode, type LinkTokenCreateRequest, Products } from 'plaid';
import Plaid from '$lib/server/Plaid';
import { DocumentFactory } from '$lib/apps/client/class/DocumentFactory';
import { PLAID_CLIENT_NAME, PLAID_EMAIL } from '$env/static/private';

export default class Item extends DocumentFactory {
	_id: ObjectId;
	itemId: string;
	institutionName: string;
	webhook: string | null;
	private _encryptedToken: string;
	private _ivHexString: string;

	static collectionName() {
		return 'items';
	}
}