import { getSql } from "@/lib/db";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
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
    RETURNING id, name, email
  `) as PublicUser[];
  return rows[0];
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as DbUser[];
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `) as PublicUser[];
  return rows[0] ?? null;
}
