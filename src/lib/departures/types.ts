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
