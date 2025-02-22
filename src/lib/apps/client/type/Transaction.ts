export default interface Transaction {
	amount: number;
	date: Date;
	description: string;
	currencyCode: string;
	pending: boolean;
	id: string;
}