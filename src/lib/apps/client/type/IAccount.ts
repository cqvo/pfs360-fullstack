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

export default interface IAccount {
	accountId: string;
	institutionName: string;
	itemId: string;
	name: string;
	mask: string;
	type: string;
	subtype: string;
	createdAt: Date;
	updatedAt: Date;
}