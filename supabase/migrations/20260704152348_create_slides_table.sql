/*
# Create slides table for hero slider management

1. New Tables
- `slides`
  - `id` (uuid, primary key)
  - `title` (text, not null) — slide headline
  - `subtitle` (text) — slide description
  - `image` (text, not null) — image URL
  - `cta` (text) — call-to-action button text
  - `link` (text) — button link
  - `sort_order` (integer, default 0) — display order
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `slides`.
- Allow anon + authenticated CRUD because slider data is intentionally public/shared (single-tenant, no auth on storefront).
*/

CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image text NOT NULL,
  cta text DEFAULT 'تسوق الآن',
  link text DEFAULT '/shop',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_slides" ON slides;
CREATE POLICY "anon_select_slides" ON slides FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_slides" ON slides;
CREATE POLICY "anon_insert_slides" ON slides FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_slides" ON slides;
CREATE POLICY "anon_update_slides" ON slides FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_slides" ON slides;
CREATE POLICY "anon_delete_slides" ON slides FOR DELETE
  TO anon, authenticated USING (true);
