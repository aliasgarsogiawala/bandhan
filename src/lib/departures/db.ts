import { getSql } from "@/lib/db";
import type { GroupDeparture, DepartureStatus } from "./types";

export interface CreateDepartureInput {
  destination: string;
  date: string;
  duration?: string;
  price?: string;
  totalSeats: number;
  seatsLeft?: number;
  status?: DepartureStatus;
}

export interface UpdateDepartureInput {
  destination?: string;
  date?: string;
  duration?: string;
  price?: string;
  totalSeats?: number;
  seatsLeft?: number;
  status?: DepartureStatus;
  isActive?: boolean;
}

export async function listActiveDepartures(): Promise<GroupDeparture[]> {
  const sql = getSql();
  return (await sql`
    SELECT * FROM group_departures WHERE is_active = true ORDER BY created_at ASC
  `) as GroupDeparture[];
}

export async function listAllDepartures(): Promise<GroupDeparture[]> {
  const sql = getSql();
  return (await sql`SELECT * FROM group_departures ORDER BY created_at ASC`) as GroupDeparture[];
}

export async function getDepartureById(id: string): Promise<GroupDeparture | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM group_departures WHERE id = ${id} LIMIT 1
  `) as GroupDeparture[];
  return rows[0] ?? null;
}

export async function createDeparture(input: CreateDepartureInput): Promise<GroupDeparture> {
  const sql = getSql();
  const seatsLeft = input.seatsLeft ?? input.totalSeats;
  const rows = (await sql`
    INSERT INTO group_departures (destination, date, duration, price, seats_left, total_seats, status)
    VALUES (
      ${input.destination}, ${input.date}, ${input.duration || null}, ${input.price || null},
      ${seatsLeft}, ${input.totalSeats}, ${input.status || "guaranteed"}
    )
    RETURNING *
  `) as GroupDeparture[];
  return rows[0];
}

export async function updateDeparture(
  id: string,
  patch: UpdateDepartureInput
): Promise<GroupDeparture | null> {
  const current = await getDepartureById(id);
  if (!current) return null;

  const sql = getSql();
  const rows = (await sql`
    UPDATE group_departures SET
      destination = ${patch.destination ?? current.destination},
      date = ${patch.date ?? current.date},
      duration = ${patch.duration ?? current.duration},
      price = ${patch.price ?? current.price},
      total_seats = ${patch.totalSeats ?? current.total_seats},
      seats_left = ${patch.seatsLeft ?? current.seats_left},
      status = ${patch.status ?? current.status},
      is_active = ${patch.isActive ?? current.is_active},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as GroupDeparture[];
  return rows[0] ?? null;
}

export async function deleteDeparture(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM group_departures WHERE id = ${id}`;
}

/**
 * Atomically claims `count` seats. Fails (returns null) if the departure
 * doesn't have enough seats left, so two agents confirming in parallel can't
 * oversell it.
 */
export async function decrementSeats(id: string, count: number): Promise<GroupDeparture | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE group_departures
    SET
      seats_left = seats_left - ${count},
      status = CASE WHEN seats_left - ${count} <= 0 THEN 'sold-out' ELSE status END,
      updated_at = now()
    WHERE id = ${id} AND seats_left >= ${count}
    RETURNING *
  `) as GroupDeparture[];
  return rows[0] ?? null;
}

export async function restoreSeats(id: string, count: number): Promise<GroupDeparture | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE group_departures
    SET
      seats_left = LEAST(seats_left + ${count}, total_seats),
      status = CASE WHEN status = 'sold-out' AND seats_left + ${count} > 0 THEN 'limited-seats' ELSE status END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as GroupDeparture[];
  return rows[0] ?? null;
}
