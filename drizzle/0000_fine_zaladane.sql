-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "dim_item_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dim_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"plaid_id" varchar NOT NULL,
	"access_token" varchar,
	"client_id" integer NOT NULL,
	"item_status_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dim_items_plaid_id_unique" UNIQUE("plaid_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dim_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"plaid_id" varchar NOT NULL,
	"item_id" integer NOT NULL,
	"institution_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar,
	"subtype" varchar,
	"created_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "dim_accounts_plaid_id_unique" UNIQUE("plaid_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dim_institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"plaid_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dim_institutions_plaid_id_unique" UNIQUE("plaid_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dim_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"taxdome_id" varchar NOT NULL,
	"company_name" varchar NOT NULL,
	"email_address" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dim_clients_taxdome_id_unique" UNIQUE("taxdome_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fact_link_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"link_token" varchar NOT NULL,
	"client_id" integer NOT NULL,
	"request_id" varchar NOT NULL,
	"request_status_id" integer DEFAULT 1 NOT NULL,
	"expiration" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"error_message" text,
	CONSTRAINT "fact_link_requests_link_token_unique" UNIQUE("link_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dim_request_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fact_report_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"plaid_id" varchar NOT NULL,
	"client_id" integer NOT NULL,
	"request_status_id" integer DEFAULT 1 NOT NULL,
	"token" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"month" varchar(3) NOT NULL,
	"year" varchar(4) NOT NULL,
	"data" jsonb,
	CONSTRAINT "fact_report_requests_plaid_id_unique" UNIQUE("plaid_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dim_items" ADD CONSTRAINT "dim_items_client_id_dim_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."dim_clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dim_items" ADD CONSTRAINT "dim_items_item_status_id_dim_item_status_id_fk" FOREIGN KEY ("item_status_id") REFERENCES "public"."dim_item_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dim_accounts" ADD CONSTRAINT "dim_accounts_item_id_dim_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."dim_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dim_accounts" ADD CONSTRAINT "dim_accounts_institution_id_dim_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."dim_institutions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fact_link_requests" ADD CONSTRAINT "fact_link_requests_client_id_dim_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."dim_clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fact_link_requests" ADD CONSTRAINT "fact_link_requests_request_status_id_dim_request_status_id_fk" FOREIGN KEY ("request_status_id") REFERENCES "public"."dim_request_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fact_report_requests" ADD CONSTRAINT "fact_report_requests_client_id_dim_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."dim_clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fact_report_requests" ADD CONSTRAINT "fact_report_requests_request_status_id_dim_request_status_id_fk" FOREIGN KEY ("request_status_id") REFERENCES "public"."dim_request_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/