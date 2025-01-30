CREATE TABLE IF NOT EXISTS "dim_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"link_token" varchar NOT NULL,
	"status" varchar DEFAULT 'Active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dim_links_link_token_unique" UNIQUE("link_token")
);
--> statement-breakpoint
ALTER TABLE "dim_items" RENAME COLUMN "key_iv" TO "access_token_iv";--> statement-breakpoint
ALTER TABLE "fact_link_requests" ADD COLUMN "status" varchar DEFAULT 'Pending' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dim_links" ADD CONSTRAINT "dim_links_client_id_dim_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."dim_clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "fact_link_requests" DROP COLUMN IF EXISTS "request_status_id";