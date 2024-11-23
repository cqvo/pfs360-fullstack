"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dimAccountsRelations = exports.dimItemsRelations = exports.dimClientsRelations = exports.factReportRequests = exports.factPlaidWebhookEvents = exports.factPlaidApiEvents = exports.factLinkRequests = exports.dimClients = exports.dimInstitutions = exports.dimAccounts = exports.dimItems = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var relations_1 = require("drizzle-orm/relations");
// Table definitions
exports.dimItems = (0, pg_core_1.pgTable)("dim_items", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    plaidItemId: (0, pg_core_1.varchar)("plaid_item_id").unique().notNull(),
    accessToken: (0, pg_core_1.varchar)("access_token").unique(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.dimClients.id; }),
    institutionId: (0, pg_core_1.integer)("institution_id").notNull().references(function () { return exports.dimInstitutions.id; }),
    status: (0, pg_core_1.varchar)("status").notNull(),
    keyIv: (0, pg_core_1.varchar)("key_iv"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
exports.dimAccounts = (0, pg_core_1.pgTable)("dim_accounts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    plaidAccountId: (0, pg_core_1.varchar)("plaid_account_id").unique().notNull(),
    itemId: (0, pg_core_1.integer)("item_id").notNull().references(function () { return exports.dimItems.id; }),
    name: (0, pg_core_1.varchar)("name").notNull(),
    type: (0, pg_core_1.varchar)("type").notNull(),
    subtype: (0, pg_core_1.varchar)("subtype").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
exports.dimInstitutions = (0, pg_core_1.pgTable)("dim_institutions", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    plaidInstitutionId: (0, pg_core_1.varchar)("plaid_institution_id").unique().notNull(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
exports.dimClients = (0, pg_core_1.pgTable)("dim_clients", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    taxdomeId: (0, pg_core_1.varchar)("taxdome_id").unique().notNull(),
    companyName: (0, pg_core_1.varchar)("company_name").notNull(),
    emailAddress: (0, pg_core_1.varchar)("email_address").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
exports.factLinkRequests = (0, pg_core_1.pgTable)("fact_link_requests", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    linkToken: (0, pg_core_1.varchar)("link_token").unique().notNull(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.dimClients.id; }),
    requestId: (0, pg_core_1.varchar)("request_id").unique().notNull(),
    status: (0, pg_core_1.varchar)("status").default('Pending').notNull(),
    linkSessionId: (0, pg_core_1.varchar)("link_session_id"),
    errorType: (0, pg_core_1.varchar)("error_type"),
    errorCode: (0, pg_core_1.varchar)("error_code"),
    expiration: (0, pg_core_1.timestamp)("expiration", { mode: 'string' }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }).defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)("completed_at", { mode: 'string' })
});
exports.factPlaidApiEvents = (0, pg_core_1.pgTable)("fact_plaid_api_events", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    requestId: (0, pg_core_1.varchar)("request_id").unique().notNull(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.dimClients.id; }),
    itemId: (0, pg_core_1.integer)("item_id"),
    plaidMethod: (0, pg_core_1.varchar)("plaid_method").notNull(),
    arguments: (0, pg_core_1.jsonb)("arguments"),
    errorType: (0, pg_core_1.varchar)("error_type"),
    errorCode: (0, pg_core_1.varchar)("error_code"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull()
});
exports.factPlaidWebhookEvents = (0, pg_core_1.pgTable)("fact_plaid_webhook_events", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    itemId: (0, pg_core_1.integer)("item_id"),
    webhookType: (0, pg_core_1.varchar)("webhook_type").notNull(),
    webhookCode: (0, pg_core_1.varchar)("webhook_code").notNull(),
    request: (0, pg_core_1.jsonb)("request").notNull(),
    errorType: (0, pg_core_1.varchar)("error_type"),
    errorCode: (0, pg_core_1.varchar)("error_code"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull()
});
exports.factReportRequests = (0, pg_core_1.pgTable)("fact_report_requests", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    plaidReportId: (0, pg_core_1.varchar)("plaid_report_id").unique().notNull(),
    plaidRequestId: (0, pg_core_1.varchar)("request_id").unique().notNull(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.dimClients.id; }),
    reportToken: (0, pg_core_1.varchar)("report_token").notNull(),
    daysRequested: (0, pg_core_1.integer)("days_requested").notNull(),
    errorType: (0, pg_core_1.varchar)("error_type"),
    errorCode: (0, pg_core_1.varchar)("error_code"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: 'string' }).defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)("completed_at", { mode: 'string' }),
    data: (0, pg_core_1.jsonb)("data"),
});
// Relation definitions
exports.dimClientsRelations = (0, relations_1.relations)(exports.dimClients, function (_a) {
    var many = _a.many;
    return ({
        dimItems: many(exports.dimItems),
        factLinkRequests: many(exports.factLinkRequests),
        factPlaidApiEvents: many(exports.factPlaidApiEvents),
        factReportRequests: many(exports.factReportRequests),
    });
});
exports.dimItemsRelations = (0, relations_1.relations)(exports.dimItems, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        dimClients: one(exports.dimClients, {
            fields: [exports.dimItems.clientId],
            references: [exports.dimClients.id]
        }),
        dimInstitutions: one(exports.dimInstitutions, {
            fields: [exports.dimItems.institutionId],
            references: [exports.dimInstitutions.id]
        }),
        dimAccounts: many(exports.dimAccounts),
        factPlaidApiEvents: many(exports.factPlaidApiEvents),
        factPlaidWebhookEvents: many(exports.factPlaidWebhookEvents),
    });
});
exports.dimAccountsRelations = (0, relations_1.relations)(exports.dimAccounts, function (_a) {
    var one = _a.one;
    return ({
        dimItems: one(exports.dimItems, {
            fields: [exports.dimAccounts.itemId],
            references: [exports.dimItems.id]
        })
    });
});
