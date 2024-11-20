CREATE TABLE IF NOT EXISTS "fact_plaid_api_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" varchar NOT NULL,
	"client_id" integer NOT NULL,
	"item_id" integer,
	"plaid_method" varchar NOT NULL,
	"arguments" jsonb,
	"error_type" varchar,
	"error_code" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fact_plaid_api_events_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fact_plaid_webhook_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer,
	"webhook_type" varchar NOT NULL,
	"webhook_code" varchar NOT NULL,
	"request" jsonb NOT NULL,
	"error_type" varchar,
	"error_code" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "dim_item_status";--> statement-breakpoint
DROP TABLE "dim_request_status";--> statement-breakpoint
ALTER TABLE "dim_institutions" RENAME COLUMN "plaid_id" TO "plaid_institution_id";--> statement-breakpoint
ALTER TABLE "fact_report_requests" RENAME COLUMN "plaid_id" TO "plaid_report_id";--> statement-breakpoint
ALTER TABLE "fact_report_requests" RENAME COLUMN "token" TO "report_token";--> statement-breakpoint
ALTER TABLE "dim_accounts" DROP CONSTRAINT "dim_accounts_plaid_id_unique";--> statement-breakpoint
ALTER TABLE "dim_institutions" DROP CONSTRAINT "dim_institutions_plaid_id_unique";--> statement-breakpoint
ALTER TABLE "dim_items" DROP CONSTRAINT "dim_items_plaid_id_unique";--> statement-breakpoint
ALTER TABLE "fact_report_requests" DROP CONSTRAINT "fact_report_requests_plaid_id_unique";--> statement-breakpoint
ALTER TABLE "fact_link_requests" DROP CONSTRAINT "fact_link_requests_request_status_id_dim_request_status_id_fk";
--> statement-breakpoint
ALTER TABLE "fact_report_requests" DROP CONSTRAINT "fact_report_requests_request_status_id_dim_request_status_id_fk";
--> statement-breakpoint
ALTER TABLE "dim_accounts" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dim_accounts" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dim_institutions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "fact_link_requests" ALTER COLUMN "request_status_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "fact_link_requests" ALTER COLUMN "request_status_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "fact_link_requests" ALTER COLUMN "request_status_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "fact_report_requests" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "fact_link_requests" ADD COLUMN "link_session_id" varchar;--> statement-breakpoint
ALTER TABLE "fact_link_requests" ADD COLUMN "error_type" varchar;--> statement-breakpoint
ALTER TABLE "fact_link_requests" ADD COLUMN "error_code" varchar;--> statement-breakpoint
ALTER TABLE "fact_report_requests" ADD COLUMN "request_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "fact_report_requests" ADD COLUMN "days_requested" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "fact_report_requests" ADD COLUMN "error_type" varchar;--> statement-breakpoint
ALTER TABLE "fact_report_requests" ADD COLUMN "error_code" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fact_plaid_api_events" ADD CONSTRAINT "fact_plaid_api_events_client_id_dim_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."dim_clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "fact_link_requests" DROP COLUMN IF EXISTS "error_message";--> statement-breakpoint
ALTER TABLE "fact_report_requests" DROP COLUMN IF EXISTS "request_status_id";--> statement-breakpoint
ALTER TABLE "fact_report_requests" DROP COLUMN IF EXISTS "month";--> statement-breakpoint
ALTER TABLE "fact_report_requests" DROP COLUMN IF EXISTS "year";--> statement-breakpoint
ALTER TABLE "dim_accounts" ADD CONSTRAINT "dim_accounts_plaid_account_id_unique" UNIQUE("plaid_account_id");--> statement-breakpoint
ALTER TABLE "dim_institutions" ADD CONSTRAINT "dim_institutions_plaid_institution_id_unique" UNIQUE("plaid_institution_id");--> statement-breakpoint
ALTER TABLE "dim_items" ADD CONSTRAINT "dim_items_plaid_item_id_unique" UNIQUE("plaid_item_id");--> statement-breakpoint
ALTER TABLE "fact_link_requests" ADD CONSTRAINT "fact_link_requests_request_id_unique" UNIQUE("request_id");--> statement-breakpoint
ALTER TABLE "fact_report_requests" ADD CONSTRAINT "fact_report_requests_plaid_report_id_unique" UNIQUE("plaid_report_id");--> statement-breakpoint
ALTER TABLE "fact_report_requests" ADD CONSTRAINT "fact_report_requests_request_id_unique" UNIQUE("request_id");