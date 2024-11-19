import { pgTable, serial, varchar, timestamp, foreignKey, unique, integer, text, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const dimItemStatus = pgTable("dim_item_status", {
	id: serial("id").primaryKey().notNull(),
	status: varchar("status"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dimItems = pgTable("dim_items", {
	id: serial("id").primaryKey().notNull(),
	plaidId: varchar("plaid_id").notNull(),
	accessToken: varchar("access_token"),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	itemStatusId: integer("item_status_id").default(1).notNull().references(() => dimItemStatus.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		dimItemsPlaidIdUnique: unique("dim_items_plaid_id_unique").on(table.plaidId),
	}
});

export const dimAccounts = pgTable("dim_accounts", {
	id: serial("id").primaryKey().notNull(),
	plaidId: varchar("plaid_id").notNull(),
	itemId: integer("item_id").notNull().references(() => dimItems.id),
	institutionId: integer("institution_id").notNull().references(() => dimInstitutions.id),
	name: varchar("name").notNull(),
	type: varchar("type"),
	subtype: varchar("subtype"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		dimAccountsPlaidIdUnique: unique("dim_accounts_plaid_id_unique").on(table.plaidId),
	}
});

export const dimInstitutions = pgTable("dim_institutions", {
	id: serial("id").primaryKey().notNull(),
	plaidId: varchar("plaid_id").notNull(),
	name: varchar("name").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		dimInstitutionsPlaidIdUnique: unique("dim_institutions_plaid_id_unique").on(table.plaidId),
	}
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
	requestStatusId: integer("request_status_id").default(1).notNull().references(() => dimRequestStatus.id),
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

export const dimRequestStatus = pgTable("dim_request_status", {
	id: serial("id").primaryKey().notNull(),
	status: varchar("status"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const factReportRequests = pgTable("fact_report_requests", {
	id: serial("id").primaryKey().notNull(),
	plaidId: varchar("plaid_id").notNull(),
	clientId: integer("client_id").notNull().references(() => dimClients.id),
	requestStatusId: integer("request_status_id").default(1).notNull().references(() => dimRequestStatus.id),
	token: varchar("token").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	month: varchar("month", { length: 3 }).notNull(),
	year: varchar("year", { length: 4 }).notNull(),
	data: jsonb("data"),
},
(table) => {
	return {
		factReportRequestsPlaidIdUnique: unique("fact_report_requests_plaid_id_unique").on(table.plaidId),
	}
});