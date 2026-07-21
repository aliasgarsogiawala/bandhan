import { getSql } from "@/lib/db";

export interface PublicAgent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "active" | "inactive";
  created_at: string;
}

interface DbAgent extends PublicAgent {
  password_hash: string;
}

export async function createAgent(
  name: string,
  email: string,
  passwordHash: string,
  phone?: string
): Promise<PublicAgent> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO agents (name, email, password_hash, phone)
    VALUES (${name}, ${email.toLowerCase()}, ${passwordHash}, ${phone || null})
    RETURNING id, name, email, phone, status, created_at
  `) as PublicAgent[];
  return rows[0];
}

export async function findAgentByEmail(email: string): Promise<DbAgent | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email, phone, status, password_hash, created_at
    FROM agents
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as DbAgent[];
  return rows[0] ?? null;
}

export async function findAgentById(id: string): Promise<PublicAgent | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email, phone, status, created_at
    FROM agents
    WHERE id = ${id}
    LIMIT 1
  `) as PublicAgent[];
  return rows[0] ?? null;
}

export async function listAgents(): Promise<PublicAgent[]> {
  const sql = getSql();
  return (await sql`
    SELECT id, name, email, phone, status, created_at
    FROM agents
    ORDER BY created_at DESC
  `) as PublicAgent[];
}

export async function setAgentStatus(
  id: string,
  status: "active" | "inactive"
): Promise<PublicAgent | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE agents SET status = ${status} WHERE id = ${id}
    RETURNING id, name, email, phone, status, created_at
  `) as PublicAgent[];
  return rows[0] ?? null;
}
