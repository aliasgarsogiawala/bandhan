import type {
  BookingPackageSnapshot,
  BookingSource,
  QuoteSnapshot,
  RoomConfiguration,
  SelectedAddon,
} from "./pricing";

export type BookingType = "standard" | "customized";

/**
 * Who the trip is for, which decides how the booking party is captured:
 * a `self` booking has one person, `guest` and `client` bookings separate the
 * lead traveller from whoever is arranging the trip.
 */
export type BookedFor = "self" | "guest" | "client";

export const BOOKED_FOR_LABELS: Record<BookedFor, string> = {
  self: "Booking for themselves",
  guest: "Booking for someone else",
  client: "Agent booking for a client",
};

export type BookingStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "approved"
  | "rejected"
  | "payment_pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new: "New Request",
  reviewing: "Under Review",
  quoted: "Pricing Confirmed",
  approved: "Approved",
  rejected: "Rejected",
  payment_pending: "Awaiting Payment",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

/** Ordered pipeline for the customer-facing progress timeline. */
export const BOOKING_STATUS_PIPELINE: BookingStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "approved",
  "payment_pending",
  "confirmed",
  "completed",
];

export type PaymentStatus = "pending" | "received";

export interface Booking {
  id: string;
  booking_code: string;
  type: BookingType;
  user_id: string | null;
  agent_id: string | null;
  package_id: string | null;
  package_title: string | null;
  departure_id: string | null;
  destination: string | null;
  travel_date: string | null;
  travellers_count: number | null;
  traveller_names: string | null;
  budget: string | null;
  special_requirements: string | null;
  /** The lead traveller — who the brochure and travel documents are addressed to. */
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  booked_for: BookedFor;
  /** Whoever raised the booking, when that isn't the lead traveller. */
  booker_name: string | null;
  booker_email: string | null;
  booker_phone: string | null;
  booker_relation: string | null;
  notify_booker: boolean;
  agent_reference: string | null;
  status: BookingStatus;
  price_amount: string | null;
  payment_status: PaymentStatus;
  internal_remarks: string | null;
  booking_source: BookingSource;
  access_token: string;
  departure_city: string | null;
  duration_label: string | null;
  adults: number;
  children_with_bed: number;
  children_without_bed: number;
  infants: number;
  room_configuration: RoomConfiguration;
  selected_addons: SelectedAddon[];
  pricing_snapshot: QuoteSnapshot;
  package_snapshot: BookingPackageSnapshot;
  terms_accepted: boolean;
  quotation_number: string;
  quotation_status: "generated" | "sent" | "accepted" | "expired";
  brochure_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingHistoryEntry {
  id: string;
  booking_id: string;
  from_status: BookingStatus | null;
  to_status: BookingStatus;
  note: string | null;
  changed_by: string;
  created_at: string;
}

export type DocumentType = "quotation" | "invoice" | "receipt" | "itinerary" | "voucher" | "other";

export interface BookingDocument {
  id: string;
  booking_id: string;
  doc_type: DocumentType;
  url: string;
  uploaded_by: string;
  created_at: string;
}

export type NotificationChannel = "email" | "whatsapp" | "in-app";

export interface BookingNotification {
  id: string;
  booking_id: string;
  channel: NotificationChannel;
  message: string;
  created_at: string;
}

export interface BookingDetail extends Booking {
  history: BookingHistoryEntry[];
  documents: BookingDocument[];
  notifications: BookingNotification[];
}
