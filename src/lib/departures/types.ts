export type DepartureStatus = "filling-fast" | "limited-seats" | "guaranteed" | "sold-out";

export interface GroupDeparture {
  id: string;
  destination: string;
  date: string;
  duration: string | null;
  price: string | null;
  seats_left: number;
  total_seats: number;
  status: DepartureStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartureUrgency {
  label: string;
  status: DepartureStatus;
}

/**
 * Derive customer-facing urgency from real inventory.
 * Absolute thresholds also cover smaller tours where a percentage alone
 * would make the message feel inconsistent.
 */
export function getDepartureUrgency(
  seatsLeft: number,
  totalSeats: number
): DepartureUrgency | null {
  const seats = Math.max(0, seatsLeft);
  const total = Math.max(1, totalSeats);

  if (seats === 0) {
    return { label: "Sold out", status: "sold-out" };
  }

  const remainingRatio = seats / total;
  if (seats <= 5 || remainingRatio <= 0.2) {
    return {
      label: `Only ${seats} seat${seats === 1 ? "" : "s"} left`,
      status: "limited-seats",
    };
  }

  if (seats <= 10 || remainingRatio <= 0.4) {
    return { label: "Filling fast", status: "filling-fast" };
  }

  return null;
}
