export type FinanceDocumentKind = "quotation" | "proforma" | "invoice" | "credit-note";
export type FinanceDocumentStatus = "Draft" | "Sent" | "Accepted" | "Part paid" | "Paid" | "Overdue" | "Void";

export interface FinanceDocument {
  id: string;
  number: string;
  kind: FinanceDocumentKind;
  customer: string;
  trip: string;
  bookingCode: string;
  issueDate: string;
  dueDate: string;
  taxableValue: number;
  tax: number;
  total: number;
  balance: number;
  status: FinanceDocumentStatus;
}

export interface FinanceExpense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  reference: string;
  bookingCode: string;
  taxableValue: number;
  tax: number;
  total: number;
  paymentMode: string;
  status: "Paid" | "Pending";
}

export const documentLabels: Record<
  FinanceDocumentKind,
  { singular: string; plural: string; prefix: string; description: string }
> = {
  quotation: {
    singular: "Quotation",
    plural: "Quotations",
    prefix: "QT",
    description: "Commercial proposals prepared for upcoming journeys.",
  },
  proforma: {
    singular: "Proforma invoice",
    plural: "Proforma invoices",
    prefix: "PI",
    description: "Advance payment requests issued before the tax invoice.",
  },
  invoice: {
    singular: "Tax invoice",
    plural: "Invoices",
    prefix: "INV",
    description: "GST-compliant sales invoices and payment balances.",
  },
  "credit-note": {
    singular: "Credit note",
    plural: "Credit notes",
    prefix: "CN",
    description: "Adjustments issued against finalized tax invoices.",
  },
};

export const sampleDocuments: FinanceDocument[] = [
  {
    id: "inv-1048",
    number: "BT/INV/26-27/1048",
    kind: "invoice",
    customer: "Neha Kapoor",
    trip: "Japan Autumn Journey",
    bookingCode: "BKG-7QX4K2",
    issueDate: "2026-07-24",
    dueDate: "2026-08-03",
    taxableValue: 212000,
    tax: 10600,
    total: 222600,
    balance: 112600,
    status: "Part paid",
  },
  {
    id: "inv-1047",
    number: "BT/INV/26-27/1047",
    kind: "invoice",
    customer: "Mehta Family",
    trip: "Swiss Alpine Escape",
    bookingCode: "BKG-2JH8M1",
    issueDate: "2026-07-21",
    dueDate: "2026-07-31",
    taxableValue: 486000,
    tax: 24300,
    total: 510300,
    balance: 0,
    status: "Paid",
  },
  {
    id: "qt-2064",
    number: "BT/QT/26-27/2064",
    kind: "quotation",
    customer: "Rohan & Aditi Shah",
    trip: "Bali Honeymoon",
    bookingCode: "BKG-9DS3P4",
    issueDate: "2026-07-27",
    dueDate: "2026-08-06",
    taxableValue: 174000,
    tax: 8700,
    total: 182700,
    balance: 182700,
    status: "Sent",
  },
  {
    id: "qt-2063",
    number: "BT/QT/26-27/2063",
    kind: "quotation",
    customer: "Aarav Textiles Pvt. Ltd.",
    trip: "Dubai Corporate Retreat",
    bookingCode: "BKG-5LM1C8",
    issueDate: "2026-07-25",
    dueDate: "2026-08-04",
    taxableValue: 825000,
    tax: 41250,
    total: 866250,
    balance: 866250,
    status: "Accepted",
  },
  {
    id: "pi-1186",
    number: "BT/PI/26-27/1186",
    kind: "proforma",
    customer: "Vikram Rao",
    trip: "Ladakh Private Circuit",
    bookingCode: "BKG-1KP6N9",
    issueDate: "2026-07-26",
    dueDate: "2026-08-02",
    taxableValue: 128000,
    tax: 6400,
    total: 134400,
    balance: 134400,
    status: "Sent",
  },
  {
    id: "cn-0318",
    number: "BT/CN/26-27/0318",
    kind: "credit-note",
    customer: "Mehta Family",
    trip: "Swiss Alpine Escape",
    bookingCode: "BKG-2JH8M1",
    issueDate: "2026-07-26",
    dueDate: "2026-07-26",
    taxableValue: 18000,
    tax: 900,
    total: 18900,
    balance: 0,
    status: "Accepted",
  },
];

export const sampleExpenses: FinanceExpense[] = [
  {
    id: "exp-601",
    date: "2026-07-27",
    vendor: "Horizon Stays Japan",
    category: "Accommodation",
    reference: "HSJ-8821",
    bookingCode: "BKG-7QX4K2",
    taxableValue: 96000,
    tax: 0,
    total: 96000,
    paymentMode: "Bank transfer",
    status: "Paid",
  },
  {
    id: "exp-600",
    date: "2026-07-26",
    vendor: "AeroConnect India",
    category: "Air tickets",
    reference: "ACI-44109",
    bookingCode: "BKG-9DS3P4",
    taxableValue: 72500,
    tax: 3625,
    total: 76125,
    paymentMode: "Corporate card",
    status: "Paid",
  },
  {
    id: "exp-599",
    date: "2026-07-24",
    vendor: "Summit Mobility",
    category: "Ground transport",
    reference: "SM-1977",
    bookingCode: "BKG-1KP6N9",
    taxableValue: 34000,
    tax: 1700,
    total: 35700,
    paymentMode: "Bank transfer",
    status: "Pending",
  },
];

export const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const displayDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
