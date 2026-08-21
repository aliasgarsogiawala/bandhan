-- Bandhan Tours — database schema (Neon Postgres)
-- Apply with:  npm run db:migrate   (reads DATABASE_URL from .env.local)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS customer_travellers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         text NOT NULL,
  email        text,
  phone        text,
  relationship text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_travellers_user_id_idx ON customer_travellers (user_id);

CREATE TABLE IF NOT EXISTS agents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  phone         text,
  status        text NOT NULL DEFAULT 'active', -- active | inactive
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agents_email_idx ON agents (email);

CREATE TABLE IF NOT EXISTS group_departures (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination   text NOT NULL,
  date          text NOT NULL,
  duration      text,
  price         text,
  seats_left    int NOT NULL DEFAULT 0,
  total_seats   int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'guaranteed', -- filling-fast | limited-seats | guaranteed | sold-out
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code         text NOT NULL UNIQUE,
  type                 text NOT NULL, -- standard | customized
  user_id              uuid REFERENCES users(id),
  agent_id             uuid REFERENCES agents(id),
  package_id           text,
  package_title        text,
  departure_id         uuid REFERENCES group_departures(id),
  destination          text,
  travel_date          text,
  travellers_count     int,
  traveller_names      text,
  budget               text,
  special_requirements text,
  contact_name         text NOT NULL,
  contact_email        text NOT NULL,
  contact_phone        text NOT NULL,
  status               text NOT NULL DEFAULT 'new',
  price_amount         text,
  payment_status       text NOT NULL DEFAULT 'pending', -- pending | received
  internal_remarks     text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS departure_id uuid REFERENCES group_departures(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_source text NOT NULL DEFAULT 'package';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS access_token text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS departure_city text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_label text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS adults int NOT NULL DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children_with_bed int NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children_without_bed int NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS infants int NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS room_configuration jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS selected_addons jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pricing_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS package_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS terms_accepted boolean NOT NULL DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS quotation_number text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS quotation_status text NOT NULL DEFAULT 'generated';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS brochure_sent_at timestamptz;

-- Who the trip is for. contact_* always describes the LEAD TRAVELLER (the
-- person the brochure is addressed to); booker_* describes whoever raised and
-- manages the booking. On a 'self' booking the two are the same person, so
-- booker_* stays null and readers fall back to contact_*.
--   self   — the person booking is travelling
--   guest  — a customer booking for family/friends/colleagues
--   client — an agent booking on behalf of their client
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booked_for text NOT NULL DEFAULT 'self';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booker_name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booker_email text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booker_phone text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booker_relation text;
-- Copy updates to the booker as well as the lead traveller.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notify_booker boolean NOT NULL DEFAULT true;
-- The agent's own reference for this booking, shown only in the agent/admin panels.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS agent_reference text;
UPDATE bookings SET access_token = encode(gen_random_bytes(24), 'hex') WHERE access_token IS NULL;
ALTER TABLE bookings ALTER COLUMN access_token SET DEFAULT encode(gen_random_bytes(24), 'hex');
ALTER TABLE bookings ALTER COLUMN access_token SET NOT NULL;
UPDATE bookings SET quotation_number = 'QT-' || replace(booking_code, 'BKG-', '') WHERE quotation_number IS NULL;
ALTER TABLE bookings ALTER COLUMN quotation_number SET NOT NULL;

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings (user_id);
CREATE INDEX IF NOT EXISTS bookings_booked_for_idx ON bookings (booked_for);
CREATE INDEX IF NOT EXISTS bookings_agent_id_idx ON bookings (agent_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_departure_id_idx ON bookings (departure_id);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_access_token_idx ON bookings (access_token);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_quotation_number_idx ON bookings (quotation_number);

CREATE TABLE IF NOT EXISTS booking_status_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_status text,
  to_status   text NOT NULL,
  note        text,
  changed_by  text NOT NULL, -- 'agent:<name>' | 'admin' | 'system'
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_status_history_booking_id_idx ON booking_status_history (booking_id);

CREATE TABLE IF NOT EXISTS booking_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  doc_type    text NOT NULL, -- quotation | invoice | itinerary | voucher | other
  url         text NOT NULL,
  uploaded_by text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_documents_booking_id_idx ON booking_documents (booking_id);

CREATE TABLE IF NOT EXISTS booking_notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  channel     text NOT NULL, -- email | whatsapp | in-app
  message     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_notifications_booking_id_idx ON booking_notifications (booking_id);

-- Shared website content. The JSON payload preserves the rich package,
-- destination and blog shapes while keeping every admin edit centralized.
CREATE TABLE IF NOT EXISTS site_content (
  collection_key text NOT NULL,
  item_id        text NOT NULL,
  data           jsonb NOT NULL,
  sort_order     int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (collection_key, item_id)
);

CREATE INDEX IF NOT EXISTS site_content_collection_idx
  ON site_content (collection_key, sort_order, updated_at DESC);

INSERT INTO group_departures (destination, date, duration, price, seats_left, total_seats, status)
SELECT * FROM (VALUES
  ('Leh Ladakh Summer Special', 'Aug 15, 2026', '7 Nights / 8 Days', '₹42,500', 6, 30, 'limited-seats'),
  ('Kashmir Autumn Paradise Group Tour', 'Sep 22, 2026', '6 Nights / 7 Days', '₹36,000', 12, 25, 'filling-fast'),
  ('Sikkim & Northeast Autumn Colors', 'Oct 10, 2026', '9 Nights / 10 Days', '₹48,000', 18, 25, 'guaranteed'),
  ('Scenic Europe Wonders Explorer', 'Nov 02, 2026', '11 Nights / 12 Days', '₹2,10,000', 4, 20, 'limited-seats')
) AS v(destination, date, duration, price, seats_left, total_seats, status)
WHERE NOT EXISTS (SELECT 1 FROM group_departures);
