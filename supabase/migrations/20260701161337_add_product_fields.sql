ALTER TABLE products ADD COLUMN IF NOT EXISTS old_price numeric(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS best_seller boolean NOT NULL DEFAULT false;
