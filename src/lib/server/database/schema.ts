import { pgTable, serial, varchar, timestamp, foreignKey, unique, integer, text, jsonb } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations";
import { sql } from "drizzle-orm"
import { json } from "@sveltejs/kit";


export const dimItems = pgTable("dim_items", {
	id: serial("id").primaryKey(),
	plaidItemId: varchar("plaid_item_id").unique().notNull(),
	accessToken: varchar("access_token").unique(),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	institutionId: integer("institution_id").notNull().references(() => dimInstitutions.id),
	status: varchar("status").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dimAccounts = pgTable("dim_accounts", {
	id: serial("id").primaryKey(),
	plaidAccountId: varchar("plaid_account_id").unique().notNull(),
	itemId: integer("item_id").notNull().references(() => dimItems.id),
	name: varchar("name").notNull(),
	type: varchar("type").notNull(),
	subtype: varchar("subtype").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dimInstitutions = pgTable("dim_institutions", {
	id: serial("id").primaryKey().notNull(),
	plaidInstitutionId: varchar("plaid_institution_id").unique().notNull(),
	name: varchar("name").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dimClients = pgTable("dim_clients", {
	id: serial("id").primaryKey(),
	taxdomeId: varchar("taxdome_id").unique().notNull(),
	companyName: varchar("company_name").notNull(),
	emailAddress: varchar("email_address").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const factLinkRequests = pgTable("fact_link_requests", {
	id: serial("id").primaryKey(),
	linkToken: varchar("link_token").unique().notNull(),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	requestId: varchar("request_id").unique().notNull(),
	status: varchar("request_status_id"),
	linkSessionId: varchar("link_session_id"),
	errorType: varchar("error_type"),
	errorCode: varchar("error_code"),
	expiration: timestamp("expiration", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' })
});

export const factPlaidApiEvents = pgTable("fact_plaid_api_events", {
	id: serial("id").primaryKey(),
	requestId: varchar("request_id").unique().notNull(),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	itemId: integer("item_id"),
	plaidMethod: varchar("plaid_method").notNull(),
	arguments: jsonb("arguments"),
	errorType: varchar("error_type"),
	errorCode: varchar("error_code"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull()
});

export const factPlaidWebhookEvents = pgTable("fact_plaid_webhook_events", {
	id: serial("id").primaryKey(),
	itemId: integer("item_id"),
	webhookType: varchar("webhook_type").notNull(),
	webhookCode: varchar("webhook_code").notNull(),
	request: jsonb("request").notNull(),
	errorType: varchar("error_type"),
	errorCode: varchar("error_code"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull()
});

export const factReportRequests = pgTable("fact_report_requests", {
	id: serial("id").primaryKey(),
	plaidReportId: varchar("plaid_report_id").unique().notNull(),
	plaidRequestId: varchar("request_id").unique().notNull(),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	reportToken: varchar("report_token").notNull(),
	daysRequested: integer("days_requested").notNull(),
	errorType: varchar("error_type"),
	errorCode: varchar("error_code"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	data: jsonb("data"),
});

export const dimClientsRelations = relations(dimClients, ({many}) => ({
	dimItems: many(dimItems),
	factLinkRequests: many(factLinkRequests),
	factPlaidApiEvents: many(factPlaidApiEvents),
	factReportRequests: many(factReportRequests),
}));

export const dimItemsRelations = relations(dimItems, ({one, many}) => ({
	dimClient: one(dimClients, {
		fields: [dimItems.clientId],
		references: [dimClients.id]
	}),
	dimAccounts: many(dimAccounts),
	dimInstitution: one(dimInstitutions, {
		fields: [dimItems.institutionId],
		references: [dimInstitutions.id]
	}),
	factPlaidApiEvents: many(factPlaidApiEvents),
}));