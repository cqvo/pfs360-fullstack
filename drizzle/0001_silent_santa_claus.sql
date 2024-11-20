ALTER TABLE "dim_items" RENAME COLUMN "plaid_id" TO "plaid_item_id";--> statement-breakpoint
ALTER TABLE "dim_accounts" RENAME COLUMN "plaid_id" TO "plaid_account_id";--> statement-breakpoint
ALTER TABLE "dim_items" DROP CONSTRAINT "dim_items_plaid_id_unique";--> statement-breakpoint
ALTER TABLE "dim_accounts" DROP CONSTRAINT "dim_accounts_plaid_id_unique";--> statement-breakpoint
-- ALTER TABLE "dim_items" DROP CONSTRAINT "dim_items_item_status_id_dim_item_status_id_fk";
--> statement-breakpoint
ALTER TABLE "dim_accounts" DROP CONSTRAINT "dim_accounts_institution_id_dim_institutions_id_fk";
--> statement-breakpoint
ALTER TABLE "dim_accounts" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dim_accounts" ALTER COLUMN "subtype" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dim_accounts" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "dim_items" ADD COLUMN "institution_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dim_items" ADD CONSTRAINT "dim_items_institution_id_dim_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."dim_institutions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "dim_items" DROP COLUMN IF EXISTS "item_status_id";--> statement-breakpoint
ALTER TABLE "dim_accounts" DROP COLUMN IF EXISTS "institution_id";--> statement-breakpoint
ALTER TABLE "dim_items" ADD CONSTRAINT "dim_items_access_token_unique" UNIQUE("access_token");--> statement-breakpoint
ALTER TABLE "dim_items" ADD CONSTRAINT "dim_items_plaid_id_unique" UNIQUE("plaid_item_id");--> statement-breakpoint
ALTER TABLE "dim_accounts" ADD CONSTRAINT "dim_accounts_plaid_id_unique" UNIQUE("plaid_account_id");