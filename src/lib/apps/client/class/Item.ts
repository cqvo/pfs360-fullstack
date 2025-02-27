import type { AccountBase, AccountsGetRequest, ItemGetRequest, ItemGetResponse } from 'plaid';
import plaid from '$lib/server/Plaid';
import { decrypt, encrypt } from '$lib/server/Crypto';

export default class Item {
	itemId: string;
	institutionName: string;
	_encryptedToken: string;
	_ivHexString: string;
	accounts: AccountBase[];
	raw?: ItemGetResponse;

	constructor({ props }) {
		this.itemId = props.itemId;
		this.institutionName = props.institutionName || '';
		this._encryptedToken = props._encryptedToken || '';
		this._ivHexString = props._ivHexString || '';
		this.accounts = props.accounts || [];
		this.raw = props.raw;
	}

	get accessToken() {
		return decrypt(this._encryptedToken, this._ivHexString);
	}

	set accessToken(plaintext: string) {
		const result = encrypt(plaintext);
		console.log('Item set accessToken', result);
		this._encryptedToken = result.encrypted;
		this._ivHexString = result.ivHexString;
	}

	static async exchangePublicToken(publicToken: string) {
		const response = await plaid.itemPublicTokenExchange({ public_token: publicToken });
		console.log('Plaid itemPublicTokenExchange', response.data);
		return response.data;
	}

	async updateItem() {
		const request: ItemGetRequest = {
			access_token: this.accessToken
		};
		const response = await plaid.itemGet(request);
		console.log('Plaid itemGet', response.data);
		this.raw = response.data;
		this.institutionName = response.data.item['institution_name'];
	}

	async updateAccounts() {
		const request: AccountsGetRequest = {
			access_token: this.accessToken
		};
		const response = await plaid.accountsGet(request);
		console.log('Plaid itemGet', response.data);
		this.accounts = response.data.accounts;
	}
}