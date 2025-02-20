// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { ObjectId } from 'mongodb';
import { Status } from '$lib/constants.ts';
import type { Products } from 'plaid';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			client?: ClientRecord;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		export interface TaxdomeRecord {
			taxdomeId: string;
			companyName: string;
			emailAddress: string;
		}
		export interface ClientRecord extends TaxdomeRecord {
			_id: ObjectId;
			links?: Link[];
			items?: Item[];
		}
		export interface Link {
			linkToken: string;
			expiration: Date;
			requestId: string;
			createdAt: Date;
			status: Status;
		}
		export interface Item {
			id: string;
			accessToken: string;
			ivHexString?: string;
			institutionId: string;
			institutionName: string;
			status: Status;
			products: Products[];
			accounts: Account[];
			webhook: string;
			updateType: string;
			createdAt: Date;
			updatedAt: Date;
			consentExpiration: Date;
		}
		export interface Account {
			id: string;
			name: string;
			mask: string;
			type: string;
			subtype: string;
			verificationStatus?: Status;
		}
		export interface AssetReport {
			clientId: string;
			id: string;
			token: string;
			requestId: string;
			createdAt: Date;
			updatedAt: Date;
		}
	}
}

export {};

