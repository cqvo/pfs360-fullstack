ALTER TABLE "fact_link_requests" ALTER COLUMN "request_status_id" SET DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE "fact_link_requests" ALTER COLUMN "request_status_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dim_items" ADD COLUMN "key_date" varchar;--> statement-breakpoint
ALTER TABLE "dim_items" ADD COLUMN "key_iv" varchar;