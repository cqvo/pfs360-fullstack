export default class HistoricalBalance {
	current: number;
	date: Date;
	currencyCode: string;

	constructor(current: number, date: Date, currencyCode: string) {
		this.current = current;
		this.date = date;
		this.currencyCode = currencyCode;
	}
}