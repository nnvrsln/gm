CREATE TABLE IF NOT EXISTS "leads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "phone" varchar(32) NOT NULL,
  "instagram" varchar(100) NOT NULL,
  "motivation" text NOT NULL,
  "marketing_consent" boolean DEFAULT false NOT NULL,
  "consent_version" varchar(20) DEFAULT '1.0' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_number" varchar(64) NOT NULL UNIQUE,
  "lead_id" uuid REFERENCES "leads"("id") ON DELETE SET NULL,
  "customer_name" varchar(100) NOT NULL,
  "customer_email" varchar(320),
  "customer_phone" varchar(32) NOT NULL,
  "product_code" varchar(64) NOT NULL,
  "product_name" varchar(200) NOT NULL,
  "amount_kopecks" integer NOT NULL CHECK ("amount_kopecks" > 0),
  "currency" varchar(3) DEFAULT 'RUB' NOT NULL,
  "status" varchar(32) DEFAULT 'pending' NOT NULL,
  "prodamus_payment_id" varchar(128) UNIQUE,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "paid_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" ("created_at");

CREATE TABLE IF NOT EXISTS "payment_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_key" varchar(160) NOT NULL UNIQUE,
  "order_id" uuid REFERENCES "orders"("id") ON DELETE SET NULL,
  "signature_valid" boolean NOT NULL,
  "payload" jsonb NOT NULL,
  "received_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "payment_events_order_id_idx" ON "payment_events" ("order_id");
