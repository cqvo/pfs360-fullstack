import type { AccountBase, Item } from 'plaid';

export default interface IItem extends Item {
	itemId: string;
	institutionName: string;
	_encryptedToken: string;
	_ivHexString: string;
	accounts: AccountBase[];
	raw?: ItemGetResponse;
	accessToken: string;
	exchangePublicToken(publicToken: string): Promise<void>;
	updateItem(): Promise<void>;
	updateAccounts(): Promise<void>;
}

// item_id: string
// institution_id?: string | null
// webhook: string | null
// error: PlaidError | null
// available_products: Array<Products>
// billed_products: Array<Products>
// products?: Array<Products>
// consented_products?: Array<Products>
// consent_expiration_time: string | null
// update_type: ItemUpdateTypeEnum