import { getSql } from "@/lib/db";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface SavedTraveller {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  created_at: string;
  updated_at: string;
}

interface DbUser extends PublicUser {
  password_hash: string;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<PublicUser> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email.toLowerCase()}, ${passwordHash})
    RETURNING id, name, email, phone
  `) as PublicUser[];
  return rows[0];
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email, phone, password_hash
    FROM users
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as DbUser[];
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email, phone
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `) as PublicUser[];
  return rows[0] ?? null;
}

export async function updateUserProfile(
  id: string,
  values: { name: string; email: string; phone?: string | null }
): Promise<PublicUser | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE users
    SET name = ${values.name.trim()},
        email = ${values.email.trim().toLowerCase()},
        phone = ${values.phone?.trim() || null},
        updated_at = now()
    WHERE id = ${id}
    RETURNING id, name, email, phone
  `) as PublicUser[];
  return rows[0] ?? null;
}

export async function listSavedTravellers(userId: string): Promise<SavedTraveller[]> {
  const sql = getSql();
  return (await sql`
    SELECT id, user_id, name, email, phone, relationship, created_at, updated_at
    FROM customer_travellers
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `) as SavedTraveller[];
}

export async function createSavedTraveller(
  userId: string,
  values: Omit<SavedTraveller, "id" | "user_id" | "created_at" | "updated_at">
): Promise<SavedTraveller> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO customer_travellers (user_id, name, email, phone, relationship)
    VALUES (
      ${userId}, ${values.name.trim()}, ${values.email?.trim().toLowerCase() || null},
      ${values.phone?.trim() || null}, ${values.relationship?.trim() || null}
    )
    RETURNING id, user_id, name, email, phone, relationship, created_at, updated_at
  `) as SavedTraveller[];
  return rows[0];
}

export async function updateSavedTraveller(
  userId: string,
  travellerId: string,
  values: Pick<SavedTraveller, "name" | "email" | "phone" | "relationship">
): Promise<SavedTraveller | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE customer_travellers
    SET name = ${values.name.trim()},
        email = ${values.email?.trim().toLowerCase() || null},
        phone = ${values.phone?.trim() || null},
        relationship = ${values.relationship?.trim() || null},
        updated_at = now()
    WHERE id = ${travellerId} AND user_id = ${userId}
    RETURNING id, user_id, name, email, phone, relationship, created_at, updated_at
  `) as SavedTraveller[];
  return rows[0] ?? null;
}

export async function deleteSavedTraveller(userId: string, travellerId: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM customer_travellers
    WHERE id = ${travellerId} AND user_id = ${userId}
    RETURNING id
  `) as Array<{ id: string }>;
  return rows.length > 0;
}
