-- Migration to separate auth from business data
-- Rename current Customer table to UserProfile for business data only

-- Create new UserProfile table for business information
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL UNIQUE, -- References auth.users.id from Supabase
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- Create unique index on user_id
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");

-- Migrate existing customer data to UserProfile (excluding auth fields)
INSERT INTO "UserProfile" ("id", "user_id", "name", "email", "image", "created_at", "updated_at")
SELECT
    "id",
    "id" as "user_id", -- Temporarily use the same ID, will be updated later
    "name",
    "email",
    "image",
    "createdAt",
    "updatedAt"
FROM "Customer"
WHERE "isAdmin" = false; -- Only migrate non-admin customers

-- Update Order table to reference UserProfile instead of Customer
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_customerId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Note: Admin users will be managed through Supabase auth.users with user_metadata.isAdmin = true
-- The Customer table will be dropped after confirming the migration is successful