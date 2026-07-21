export type BookingType = "standard" | "customized";

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
  destination: string | null;
  travel_date: string | null;
  travellers_count: number | null;
  traveller_names: string | null;
  budget: string | null;
  special_requirements: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: BookingStatus;
  price_amount: string | null;
  payment_status: PaymentStatus;
  internal_remarks: string | null;
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

export type DocumentType = "quotation" | "invoice" | "itinerary" | "voucher" | "other";

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
