import { pgTable, foreignKey, serial, varchar, integer, timestamp, unique, text, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const dimItems = pgTable("dim_items", {
	id: serial("id").primaryKey().notNull(),
	plaidItemId: varchar("plaid_item_id").notNull(),
	accessToken: varchar("access_token"),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	itemStatusId: integer("item_status_id").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dimAccounts = pgTable("dim_accounts", {
	id: serial("id").primaryKey().notNull(),
	plaidAccountId: varchar("plaid_account_id").notNull(),
	itemId: integer("item_id").notNull().references(() => dimItems.id),
	institutionId: integer("institution_id").notNull().references(() => dimInstitutions.id),
	name: varchar("name").notNull(),
	type: varchar("type"),
	subtype: varchar("subtype"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const dimInstitutions = pgTable("dim_institutions", {
	id: serial("id").primaryKey().notNull(),
	plaidInstitutionId: varchar("plaid_institution_id").notNull(),
	name: varchar("name").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dimClients = pgTable("dim_clients", {
	id: serial("id").primaryKey().notNull(),
	taxdomeId: varchar("taxdome_id").notNull(),
	companyName: varchar("company_name").notNull(),
	emailAddress: varchar("email_address").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		dimClientsTaxdomeIdUnique: unique("dim_clients_taxdome_id_unique").on(table.taxdomeId),
	}
});

export const factLinkRequests = pgTable("fact_link_requests", {
	id: serial("id").primaryKey().notNull(),
	linkToken: varchar("link_token").notNull(),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	requestId: varchar("request_id").notNull(),
	requestStatusId: integer("request_status_id").default(1).notNull(),
	expiration: timestamp("expiration", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	errorMessage: text("error_message"),
},
(table) => {
	return {
		factLinkRequestsLinkTokenUnique: unique("fact_link_requests_link_token_unique").on(table.linkToken),
	}
});

export const factReportRequests = pgTable("fact_report_requests", {
	id: serial("id").primaryKey().notNull(),
	plaidReportId: varchar("plaid_report_id").notNull(),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	requestStatusId: integer("request_status_id").default(1).notNull(),
	token: varchar("token").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	month: varchar("month", { length: 3 }).notNull(),
	year: varchar("year", { length: 4 }).notNull(),
	data: jsonb("data"),
});

export const factPlaidApiEvents = pgTable("fact_plaid_api_events", {
	id: serial("id").primaryKey().notNull(),
	requestId: varchar("request_id").notNull(),
	clientId: integer("client_id").notNull(),
	itemId: integer("item_id"),
	plaidMethod: varchar("plaid_method").notNull(),
	arguments: jsonb("arguments"),
	errorType: varchar("error_type"),
	errorCode: varchar("error_code"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		factPlaidApiEventsRequestIdUnique: unique("fact_plaid_api_events_request_id_unique").on(table.requestId),
	}
});

export const factPlaidWebhookEvents = pgTable("fact_plaid_webhook_events", {
	id: serial("id").primaryKey().notNull(),
	itemId: integer("item_id"),
	webhookType: varchar("webhook_type").notNull(),
	webhookCode: varchar("webhook_code").notNull(),
	request: jsonb("request").notNull(),
	errorType: varchar("error_type"),
	errorCode: varchar("error_code"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});