import { relations } from "drizzle-orm/relations";
import { dimClients, dimItems, dimItemStatus, dimAccounts, dimInstitutions, factLinkRequests, dimRequestStatus, factReportRequests } from "./schema";

export const dimItemsRelations = relations(dimItems, ({one, many}) => ({
	dimClient: one(dimClients, {
		fields: [dimItems.clientId],
		references: [dimClients.id]
	}),
	dimItemStatus: one(dimItemStatus, {
		fields: [dimItems.itemStatusId],
		references: [dimItemStatus.id]
	}),
	dimAccounts: many(dimAccounts),
}));

export const dimClientsRelations = relations(dimClients, ({many}) => ({
	dimItems: many(dimItems),
	factLinkRequests: many(factLinkRequests),
	factReportRequests: many(factReportRequests),
}));

export const dimItemStatusRelations = relations(dimItemStatus, ({many}) => ({
	dimItems: many(dimItems),
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
	dimRequestStatus: one(dimRequestStatus, {
		fields: [factLinkRequests.requestStatusId],
		references: [dimRequestStatus.id]
	}),
}));

export const dimRequestStatusRelations = relations(dimRequestStatus, ({many}) => ({
	factLinkRequests: many(factLinkRequests),
	factReportRequests: many(factReportRequests),
}));

export const factReportRequestsRelations = relations(factReportRequests, ({one}) => ({
	dimClient: one(dimClients, {
		fields: [factReportRequests.clientId],
		references: [dimClients.id]
	}),
	dimRequestStatus: one(dimRequestStatus, {
		fields: [factReportRequests.requestStatusId],
		references: [dimRequestStatus.id]
	}),
}));