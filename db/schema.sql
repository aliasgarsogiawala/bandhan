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

CREATE TABLE IF NOT EXISTS bookings (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code         text NOT NULL UNIQUE,
  type                 text NOT NULL, -- standard | customized
  user_id              uuid REFERENCES users(id),
  agent_id             uuid REFERENCES agents(id),
  package_id           text,
  package_title        text,
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

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings (user_id);
CREATE INDEX IF NOT EXISTS bookings_agent_id_idx ON bookings (agent_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);

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
