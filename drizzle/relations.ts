import { relations } from "drizzle-orm/relations";
import { dimClients, dimItems, dimAccounts, dimInstitutions, factLinkRequests, factReportRequests } from "./schema";

export const dimItemsRelations = relations(dimItems, ({one, many}) => ({
	dimClient: one(dimClients, {
		fields: [dimItems.clientId],
		references: [dimClients.id]
	}),
	dimAccounts: many(dimAccounts),
}));

export const dimClientsRelations = relations(dimClients, ({many}) => ({
	dimItems: many(dimItems),
	factLinkRequests: many(factLinkRequests),
	factReportRequests: many(factReportRequests),
}));

export const dimAccountsRelations = relations(dimAccounts, ({one}) => ({
	dimItem: one(dimItems, {
		fields: [dimAccounts.itemId],
		references: [dimItems.id]
	}),
	dimInstitution: one(dimInstitutions, {
		fields: [dimAccounts.institutionId],
		references: [dimInstitutions.id]
	}),
}));

export const dimInstitutionsRelations = relations(dimInstitutions, ({many}) => ({
	dimAccounts: many(dimAccounts),
}));

export const factLinkRequestsRelations = relations(factLinkRequests, ({one}) => ({
	dimClient: one(dimClients, {
		fields: [factLinkRequests.clientId],
		references: [dimClients.id]
	}),
}));

export const factReportRequestsRelations = relations(factReportRequests, ({one}) => ({
	dimClient: one(dimClients, {
		fields: [factReportRequests.clientId],
		references: [dimClients.id]
	}),
}));