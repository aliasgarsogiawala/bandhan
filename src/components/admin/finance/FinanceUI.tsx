"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  CalendarClock,
  Check,
  ChevronDown,
  CircleAlert,
  Download,
  FilePlus2,
  Landmark,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Trash2,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import {
  displayDate,
  documentLabels,
  inr,
  sampleDocuments,
  sampleExpenses,
} from "@/lib/finance/data";
import type {
  FinanceDocument,
  FinanceDocumentKind,
  FinanceDocumentStatus,
} from "@/lib/finance/data";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-primary transition hover:border-slate-400 hover:bg-slate-50";
const fieldClass =
  "mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-primary outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";
const textareaClass =
  "mt-1.5 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      {label} {required && <span className="text-red-600">*</span>}
      {children}
      {hint && <span className="mt-1 block text-[11px] font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-primary">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

const statusClass: Record<FinanceDocumentStatus | "Pending", string> = {
  Draft: "border-slate-200 bg-slate-50 text-slate-600",
  Sent: "border-blue-200 bg-blue-50 text-blue-700",
  Accepted: "border-teal-200 bg-teal-50 text-teal-700",
  "Part paid": "border-amber-200 bg-amber-50 text-amber-700",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Overdue: "border-red-200 bg-red-50 text-red-700",
  Void: "border-slate-300 bg-slate-100 text-slate-500",
  Pending: "border-orange-200 bg-orange-50 text-orange-700",
};

function Status({ value }: { value: FinanceDocumentStatus | "Pending" }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClass[value]}`}>
      {value}
    </span>
  );
}

function Kpi({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "warning" | "positive";
}) {
  const tones = {
    default: "text-primary",
    warning: "text-amber-700",
    positive: "text-emerald-700",
  };
  return (
    <div className="border-r border-slate-200 px-5 py-4 last:border-r-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
    </div>
  );
}

export function FinanceOverview() {
  const invoices = sampleDocuments.filter((item) => item.kind === "invoice");
  const receivables = invoices.reduce((sum, item) => sum + item.balance, 0);
  const billed = invoices.reduce((sum, item) => sum + item.total, 0);
  const expenses = sampleExpenses.reduce((sum, item) => sum + item.total, 0);
  const activity = [...sampleDocuments].sort((a, b) => b.issueDate.localeCompare(a.issueDate)).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Finance overview"
        description="Sales, receivables, expenses, and statutory records for FY 2026–27."
        action={
          <Link href="/admin/finance/invoices/new" className={primaryButton}>
            <FilePlus2 className="h-4 w-4" /> New invoice
          </Link>
        }
      />

      <div className="mb-6 grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Gross sales" value={inr(billed)} detail="2 finalized invoices" />
        <Kpi label="Receivables" value={inr(receivables)} detail="1 balance awaiting collection" tone="warning" />
        <Kpi label="Operating expenses" value={inr(expenses)} detail="This reporting period" />
        <Kpi label="Net cash position" value={inr(billed - receivables - expenses)} detail="Collected less recorded expenses" tone="positive" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(310px,0.7fr)]">
        <SectionCard
          title="Recent documents"
          description="Latest sales documents across the finance workflow."
          action={<Link href="/admin/finance/invoices" className="text-xs font-semibold text-primary hover:text-accent">View all</Link>}
        >
          <DocumentTable records={activity} compact />
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Collection watch" description="Items requiring finance action.">
            <div className="space-y-3">
              <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-3">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <div>
                  <p className="text-xs font-semibold text-amber-900">₹1,12,600 due from Neha Kapoor</p>
                  <p className="mt-1 text-[11px] leading-4 text-amber-700">Invoice BT/INV/26-27/1048 is due 03 Aug 2026.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-md border border-slate-200 p-3">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-primary">2 quotations expire this week</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">Follow up before their validity window closes.</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Quick actions">
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Create quotation", "/admin/finance/quotations/new"],
                ["Add expense", "/admin/finance/expenses/new"],
                ["View ledger", "/admin/finance/reports/customer-ledger"],
                ["GST report", "/admin/finance/reports/hsn"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="rounded-md border border-slate-200 p-3 text-xs font-semibold text-primary hover:border-primary/30 hover:bg-slate-50">
                  {label} <ArrowRight className="mt-2 h-3.5 w-3.5 text-slate-400" />
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function DocumentTable({ records, compact = false }: { records: FinanceDocument[]; compact?: boolean }) {
  return (
    <div className={compact ? "-mx-5 -mb-5" : ""}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Customer / trip</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3">Status</th>
              <th className="w-10 px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <p className="font-semibold text-primary">{record.number}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{record.bookingCode}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{record.customer}</p>
                  <p className="mt-0.5 max-w-52 truncate text-xs text-slate-500">{record.trip}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{displayDate(record.issueDate)}</td>
                <td className="px-4 py-3 text-right font-medium text-primary">{inr(record.total)}</td>
                <td className="px-4 py-3 text-right text-slate-600">{inr(record.balance)}</td>
                <td className="px-4 py-3"><Status value={record.status} /></td>
                <td className="px-4 py-3"><button aria-label={`Actions for ${record.number}`} className="text-slate-400 hover:text-primary"><MoreHorizontal className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DocumentList({ kind }: { kind: FinanceDocumentKind }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const labels = documentLabels[kind];
  const records = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sampleDocuments.filter(
      (item) =>
        item.kind === kind &&
        (status === "All" || item.status === status) &&
        (!normalized ||
          [item.number, item.customer, item.trip, item.bookingCode].some((value) =>
            value.toLowerCase().includes(normalized)
          ))
    );
  }, [kind, query, status]);

  const total = records.reduce((sum, item) => sum + item.total, 0);
  const balance = records.reduce((sum, item) => sum + item.balance, 0);

  return (
    <div>
      <PageHeader
        title={labels.plural}
        description={labels.description}
        action={
          <Link href={`/admin/finance/${kind === "proforma" ? "proforma-invoices" : `${kind}s`}/new`} className={primaryButton}>
            <Plus className="h-4 w-4" /> New {labels.singular.toLowerCase()}
          </Link>
        }
      />

      <div className="mb-5 grid overflow-hidden rounded-lg border border-slate-200 bg-white sm:grid-cols-3">
        <Kpi label="Documents" value={String(records.length)} detail="Current filtered result" />
        <Kpi label="Document value" value={inr(total)} detail="Tax inclusive" />
        <Kpi label="Open balance" value={inr(balance)} detail="Awaiting settlement" tone={balance ? "warning" : "positive"} />
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search number, customer, booking…" className={`${fieldClass} mt-0 pl-9`} />
          </div>
          <div className="flex gap-2">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className={`${fieldClass} mt-0 min-w-36`}>
              {["All", "Draft", "Sent", "Accepted", "Part paid", "Paid", "Overdue", "Void"].map((value) => <option key={value}>{value}</option>)}
            </select>
            <button className={secondaryButton}><Download className="h-4 w-4" /> Export</button>
          </div>
        </div>
        {records.length ? <DocumentTable records={records} /> : <p className="p-12 text-center text-sm text-slate-500">No matching documents.</p>}
      </section>
    </div>
  );
}

interface LineItem {
  id: number;
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  discount: number;
  gst: number;
}

export function DocumentEditor({ kind }: { kind: FinanceDocumentKind }) {
  const router = useRouter();
  const labels = documentLabels[kind];
  const [saving, setSaving] = useState(false);
  const [taxMode, setTaxMode] = useState<"intra" | "inter">("intra");
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "Tour package services", hsn: "998555", qty: 1, unit: "Package", rate: 0, discount: 0, gst: 5 },
  ]);

  const calculated = useMemo(() => {
    const lines = items.map((item) => {
      const gross = item.qty * item.rate;
      const discountValue = gross * (item.discount / 100);
      const taxable = gross - discountValue;
      const tax = taxable * (item.gst / 100);
      return { taxable, tax, total: taxable + tax };
    });
    return {
      taxable: lines.reduce((sum, line) => sum + line.taxable, 0),
      tax: lines.reduce((sum, line) => sum + line.tax, 0),
      total: lines.reduce((sum, line) => sum + line.total, 0),
    };
  }, [items]);

  const updateItem = <K extends keyof LineItem>(id: number, key: K, value: LineItem[K]) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      const route = kind === "proforma" ? "proforma-invoices" : `${kind}s`;
      router.push(`/admin/finance/${route}`);
    }, 500);
  };

  return (
    <form onSubmit={save}>
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/finance" className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Finance</Link>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">Create {labels.singular.toLowerCase()}</h1>
          <p className="mt-1 text-sm text-slate-500">All statutory and customer-facing details are included below.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={secondaryButton}>Save draft</button>
          <button type="submit" disabled={saving} className={primaryButton}>{saving ? "Saving…" : `Create ${labels.singular.toLowerCase()}`} <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <SectionCard title="Document details" description="Numbering, dates, booking reference, and tax jurisdiction.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label={`${labels.singular} number`} required><input className={fieldClass} defaultValue={`BT/${labels.prefix}/26-27/AUTO`} required /></Field>
              <Field label="Issue date" required><input type="date" className={fieldClass} defaultValue="2026-07-28" required /></Field>
              <Field label={kind === "quotation" ? "Valid until" : "Due date"} required><input type="date" className={fieldClass} defaultValue="2026-08-07" required /></Field>
              <Field label="Booking reference" required><input className={fieldClass} placeholder="BKG-XXXXXX" required /></Field>
              {kind === "credit-note" && <Field label="Original invoice no." required><input className={fieldClass} placeholder="BT/INV/26-27/…" required /></Field>}
              <Field label="Place of supply" required><select className={fieldClass} defaultValue="Maharashtra"><option>Maharashtra</option><option>Delhi</option><option>Gujarat</option><option>Karnataka</option><option>Other state / UT</option></select></Field>
              <Field label="Tax treatment" required><select className={fieldClass} value={taxMode} onChange={(event) => setTaxMode(event.target.value as "intra" | "inter")}><option value="intra">Intra-state (CGST + SGST)</option><option value="inter">Inter-state (IGST)</option></select></Field>
              <Field label="Currency"><select className={fieldClass}><option>INR — Indian Rupee</option><option>USD — US Dollar</option><option>EUR — Euro</option></select></Field>
              {kind === "invoice" && <Field label="Reverse charge"><select className={fieldClass}><option>No</option><option>Yes</option></select></Field>}
            </div>
          </SectionCard>

          <SectionCard title="Bill to" description="Legal customer identity and contact details used on the document.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer / legal name" required><input className={fieldClass} placeholder="Company or traveller name" required /></Field>
              <Field label="GSTIN"><input className={fieldClass} placeholder="27ABCDE1234F1Z5" maxLength={15} /></Field>
              <Field label="Email" required><input type="email" className={fieldClass} placeholder="accounts@example.com" required /></Field>
              <Field label="Phone" required><input type="tel" className={fieldClass} placeholder="+91 98XXX XXXXX" required /></Field>
              <div className="sm:col-span-2"><Field label="Billing address" required><textarea className={textareaClass} placeholder="Street, city, state, PIN, country" required /></Field></div>
              <Field label="State / UT" required><input className={fieldClass} placeholder="Maharashtra" required /></Field>
              <Field label="State code" required><input className={fieldClass} placeholder="27" maxLength={2} required /></Field>
              <Field label="PAN"><input className={fieldClass} placeholder="ABCDE1234F" maxLength={10} /></Field>
              <Field label="Attention / traveller"><input className={fieldClass} placeholder="Primary contact name" /></Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Line items"
            description="Use SAC 998555 for tour operator services where applicable; confirm treatment with your tax advisor."
            action={<button type="button" onClick={() => setItems((current) => [...current, { id: Date.now(), description: "", hsn: "998555", qty: 1, unit: "Package", rate: 0, discount: 0, gst: 5 }])} className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Plus className="h-3.5 w-3.5" /> Add line</button>}
          >
            <div className="-mx-5 overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-y border-slate-200 bg-slate-50 text-left text-[10px] uppercase tracking-wider text-slate-500">
                  <tr><th className="px-3 py-2.5">Description</th><th className="px-3 py-2.5">SAC / HSN</th><th className="px-3 py-2.5">Qty</th><th className="px-3 py-2.5">Unit</th><th className="px-3 py-2.5">Rate</th><th className="px-3 py-2.5">Disc. %</th><th className="px-3 py-2.5">GST %</th><th className="px-3 py-2.5 text-right">Amount</th><th /></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const gross = item.qty * item.rate * (1 - item.discount / 100);
                    return (
                      <tr key={item.id}>
                        <td className="px-3 py-3"><input value={item.description} onChange={(event) => updateItem(item.id, "description", event.target.value)} className={`${fieldClass} mt-0 min-w-48`} required /></td>
                        <td className="px-3 py-3"><input value={item.hsn} onChange={(event) => updateItem(item.id, "hsn", event.target.value)} className={`${fieldClass} mt-0 w-24`} required /></td>
                        <td className="px-3 py-3"><input type="number" min="0.01" step="0.01" value={item.qty} onChange={(event) => updateItem(item.id, "qty", Number(event.target.value))} className={`${fieldClass} mt-0 w-20`} required /></td>
                        <td className="px-3 py-3"><select value={item.unit} onChange={(event) => updateItem(item.id, "unit", event.target.value)} className={`${fieldClass} mt-0 w-28`}><option>Package</option><option>Person</option><option>Night</option><option>Ticket</option><option>Service</option></select></td>
                        <td className="px-3 py-3"><input type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.id, "rate", Number(event.target.value))} className={`${fieldClass} mt-0 w-28`} required /></td>
                        <td className="px-3 py-3"><input type="number" min="0" max="100" value={item.discount} onChange={(event) => updateItem(item.id, "discount", Number(event.target.value))} className={`${fieldClass} mt-0 w-20`} /></td>
                        <td className="px-3 py-3"><select value={item.gst} onChange={(event) => updateItem(item.id, "gst", Number(event.target.value))} className={`${fieldClass} mt-0 w-20`}><option value={0}>0</option><option value={5}>5</option><option value={12}>12</option><option value={18}>18</option><option value={28}>28</option></select></td>
                        <td className="px-3 py-3 text-right text-sm font-semibold text-primary">{inr(gross)}</td>
                        <td className="px-3 py-3"><button type="button" onClick={() => setItems((current) => current.filter((line) => line.id !== item.id))} disabled={items.length === 1} className="text-slate-400 hover:text-red-600 disabled:opacity-30" aria-label="Remove line"><Trash2 className="h-4 w-4" /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Terms and notes">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer notes"><textarea className={textareaClass} placeholder="Included services, exclusions, cancellation policy…" /></Field>
              <Field label="Payment terms"><textarea className={textareaClass} defaultValue="Payment due within 10 days. Services remain subject to availability until payment confirmation." /></Field>
              <Field label="Internal memo" hint="Not printed on the customer document."><textarea className={textareaClass} placeholder="Finance or operations notes" /></Field>
              <Field label="Bank / payment instructions"><textarea className={textareaClass} placeholder="Bank name, account name, account number, IFSC, UPI ID" /></Field>
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <SectionCard title="Amount summary">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Taxable value</dt><dd className="font-medium text-primary">{inr(calculated.taxable)}</dd></div>
              {taxMode === "intra" ? (
                <>
                  <div className="flex justify-between"><dt className="text-slate-500">CGST</dt><dd>{inr(calculated.tax / 2)}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">SGST</dt><dd>{inr(calculated.tax / 2)}</dd></div>
                </>
              ) : <div className="flex justify-between"><dt className="text-slate-500">IGST</dt><dd>{inr(calculated.tax)}</dd></div>}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-end justify-between"><dt className="font-semibold text-primary">Grand total</dt><dd className="text-xl font-semibold text-primary">{inr(calculated.total)}</dd></div>
                <p className="mt-1 text-right text-[10px] text-slate-400">Rounded to nearest rupee</p>
              </div>
            </dl>
          </SectionCard>
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-teal-900"><Check className="h-4 w-4" /> Field coverage checked</p>
            <p className="mt-2 text-[11px] leading-5 text-teal-700">Includes GST identity, place of supply, state code, SAC/HSN, tax split, booking reference, payment terms, and linked-document fields.</p>
          </div>
        </aside>
      </div>
    </form>
  );
}

export function ExpensesPage() {
  const total = sampleExpenses.reduce((sum, item) => sum + item.total, 0);
  const inputTax = sampleExpenses.reduce((sum, item) => sum + item.tax, 0);
  return (
    <div>
      <PageHeader title="Expenses" description="Vendor costs, input tax, and booking-level profitability." action={<Link href="/admin/finance/expenses/new" className={primaryButton}><Plus className="h-4 w-4" /> Record expense</Link>} />
      <div className="mb-5 grid overflow-hidden rounded-lg border border-slate-200 bg-white sm:grid-cols-3">
        <Kpi label="Recorded expenses" value={inr(total)} detail="Current reporting period" />
        <Kpi label="Input GST" value={inr(inputTax)} detail="Subject to eligibility" />
        <Kpi label="Pending payment" value={inr(sampleExpenses.filter((item) => item.status === "Pending").reduce((sum, item) => sum + item.total, 0))} detail="Vendor liabilities" tone="warning" />
      </div>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4"><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className={`${fieldClass} mt-0 pl-9`} placeholder="Search vendor, booking, reference…" /></div><button className={secondaryButton}><Download className="h-4 w-4" /> Export</button></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Vendor</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Booking / reference</th><th className="px-4 py-3 text-right">Tax</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{sampleExpenses.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-4 py-3 text-xs text-slate-600">{displayDate(item.date)}</td><td className="px-4 py-3"><p className="font-medium text-primary">{item.vendor}</p><p className="text-[11px] text-slate-400">{item.reference}</p></td><td className="px-4 py-3 text-slate-600">{item.category}</td><td className="px-4 py-3 text-xs text-slate-600">{item.bookingCode}</td><td className="px-4 py-3 text-right">{inr(item.tax)}</td><td className="px-4 py-3 text-right font-semibold text-primary">{inr(item.total)}</td><td className="px-4 py-3 text-xs text-slate-600">{item.paymentMode}</td><td className="px-4 py-3"><Status value={item.status} /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function ExpenseEditor() {
  const router = useRouter();
  const [taxable, setTaxable] = useState(0);
  const [gst, setGst] = useState(5);
  const tax = taxable * (gst / 100);
  return (
    <form onSubmit={(event) => { event.preventDefault(); router.push("/admin/finance/expenses"); }}>
      <PageHeader title="Record expense" description="Capture a vendor bill with payment, tax, and booking allocation." action={<div className="flex gap-2"><Link href="/admin/finance/expenses" className={secondaryButton}>Cancel</Link><button className={primaryButton}>Save expense</button></div>} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <SectionCard title="Vendor bill">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Vendor / payee" required><input className={fieldClass} required /></Field>
              <Field label="Vendor GSTIN"><input className={fieldClass} placeholder="27ABCDE1234F1Z5" maxLength={15} /></Field>
              <Field label="Expense category" required><select className={fieldClass} required><option>Accommodation</option><option>Air tickets</option><option>Ground transport</option><option>Visa & insurance</option><option>Meals & activities</option><option>Marketing</option><option>Office & administration</option><option>Professional fees</option><option>Other</option></select></Field>
              <Field label="Bill / receipt number" required><input className={fieldClass} required /></Field>
              <Field label="Bill date" required><input type="date" className={fieldClass} defaultValue="2026-07-28" required /></Field>
              <Field label="Payment due date"><input type="date" className={fieldClass} /></Field>
              <Field label="Booking reference"><input className={fieldClass} placeholder="BKG-XXXXXX" /></Field>
              <Field label="Place of supply"><input className={fieldClass} placeholder="Maharashtra" /></Field>
              <Field label="Reverse charge"><select className={fieldClass}><option>No</option><option>Yes</option></select></Field>
              <div className="sm:col-span-2 lg:col-span-3"><Field label="Description" required><textarea className={textareaClass} placeholder="Business purpose and services purchased" required /></Field></div>
            </div>
          </SectionCard>
          <SectionCard title="Amounts and payment">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Taxable amount" required><input type="number" min="0" step="0.01" value={taxable} onChange={(event) => setTaxable(Number(event.target.value))} className={fieldClass} required /></Field>
              <Field label="GST rate"><select value={gst} onChange={(event) => setGst(Number(event.target.value))} className={fieldClass}><option value={0}>0%</option><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option></select></Field>
              <Field label="TDS section"><select className={fieldClass}><option>Not applicable</option><option>194C — Contractor</option><option>194J — Professional services</option><option>194H — Commission</option><option>194I — Rent</option></select></Field>
              <Field label="TDS amount"><input type="number" min="0" step="0.01" className={fieldClass} defaultValue="0" /></Field>
              <Field label="Payment status" required><select className={fieldClass}><option>Paid</option><option>Pending</option><option>Part paid</option></select></Field>
              <Field label="Payment mode"><select className={fieldClass}><option>Bank transfer</option><option>Corporate card</option><option>UPI</option><option>Cash</option><option>Cheque</option></select></Field>
              <Field label="Payment reference"><input className={fieldClass} placeholder="UTR / transaction ID" /></Field>
              <Field label="Paid from account"><input className={fieldClass} placeholder="Bank or cash account" /></Field>
              <Field label="Attachment"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className={`${fieldClass} file:mr-3 file:border-0 file:bg-transparent file:text-xs file:font-semibold`} /></Field>
            </div>
          </SectionCard>
        </div>
        <aside className="xl:sticky xl:top-24"><SectionCard title="Expense summary"><dl className="space-y-3 text-sm"><div className="flex justify-between"><dt className="text-slate-500">Taxable value</dt><dd>{inr(taxable)}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Input GST</dt><dd>{inr(tax)}</dd></div><div className="flex justify-between border-t border-slate-200 pt-3 font-semibold text-primary"><dt>Total bill value</dt><dd className="text-lg">{inr(taxable + tax)}</dd></div></dl></SectionCard></aside>
      </div>
    </form>
  );
}

const reports = [
  { slug: "invoices", label: "Invoice report" },
  { slug: "quotations", label: "Quotation report" },
  { slug: "expenses", label: "Expense report" },
  { slug: "customer-ledger", label: "Customer ledger" },
  { slug: "hsn", label: "HSN / SAC report" },
];

export function ReportPage({ type }: { type: string }) {
  const active = reports.find((report) => report.slug === type) || reports[0];
  const bars = [42, 57, 49, 72, 66, 88];
  return (
    <div>
      <PageHeader title={active.label} description="Auditable financial analysis with period, status, customer, and tax filters." action={<button className={secondaryButton}><Download className="h-4 w-4" /> Export CSV</button>} />
      <div className="mb-5 flex overflow-x-auto border-b border-slate-200">{reports.map((report) => <Link key={report.slug} href={`/admin/finance/reports/${report.slug}`} className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold ${report.slug === active.slug ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-primary"}`}>{report.label}</Link>)}</div>
      <div className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="From"><input type="date" defaultValue="2026-04-01" className={fieldClass} /></Field>
        <Field label="To"><input type="date" defaultValue="2026-07-28" className={fieldClass} /></Field>
        <Field label="Customer"><select className={fieldClass}><option>All customers</option><option>Neha Kapoor</option><option>Mehta Family</option></select></Field>
        <Field label="Status"><select className={fieldClass}><option>All statuses</option><option>Paid</option><option>Pending</option><option>Overdue</option></select></Field>
        <div className="flex items-end"><button className={`${primaryButton} w-full`}>Run report</button></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard title="Period analysis" description="Monthly document value for the selected range.">
          <div className="flex h-56 items-end gap-4 border-b border-l border-slate-200 px-4 pt-5">
            {bars.map((height, index) => <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2"><div className="w-full max-w-14 rounded-t-sm bg-primary/85" style={{ height: `${height}%` }} /><span className="text-[10px] text-slate-400">{["Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]}</span></div>)}
          </div>
        </SectionCard>
        <SectionCard title="Report summary">
          <dl className="space-y-4"><div><dt className="text-xs text-slate-500">Gross value</dt><dd className="mt-1 text-2xl font-semibold text-primary">{inr(1418550)}</dd></div><div className="flex justify-between border-t border-slate-100 pt-3 text-sm"><dt className="text-slate-500">Taxable value</dt><dd className="font-medium">{inr(1351000)}</dd></div><div className="flex justify-between text-sm"><dt className="text-slate-500">GST</dt><dd className="font-medium">{inr(67550)}</dd></div><div className="flex justify-between text-sm"><dt className="text-slate-500">Records</dt><dd className="font-medium">6</dd></div></dl>
        </SectionCard>
      </div>
    </div>
  );
}

export function HsnCodesPage() {
  const codes = [
    ["998555", "Tour operator services", "5%", "Services"],
    ["996411", "Local land transport services", "5%", "Services"],
    ["996331", "Hotel accommodation services", "12% / 18%", "Services"],
    ["998551", "Travel agency services", "18%", "Services"],
    ["998312", "Business consulting services", "18%", "Services"],
  ];
  return (
    <div>
      <PageHeader title="HSN / SAC codes" description="Central tax-code register used by document line items." action={<button className={primaryButton}><Plus className="h-4 w-4" /> Add code</button>} />
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className={`${fieldClass} mt-0 pl-9`} placeholder="Search code or description…" /></div></div>
        <table className="w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Default GST</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{codes.map((code) => <tr key={code[0]}><td className="px-4 py-3 font-mono font-semibold text-primary">{code[0]}</td><td className="px-4 py-3 text-slate-700">{code[1]}</td><td className="px-4 py-3">{code[2]}</td><td className="px-4 py-3">{code[3]}</td><td className="px-4 py-3"><Status value="Accepted" /></td></tr>)}</tbody></table>
      </section>
      <p className="mt-3 text-xs text-slate-400">Tax classification depends on the supply structure and applicable notification. Confirm final codes and rates with the company tax advisor.</p>
    </div>
  );
}

export function RemindersPage() {
  const rows = [
    ["Payment reminder", "Neha Kapoor", "BT/INV/26-27/1048", "03 Aug 2026", "Email + WhatsApp", "Scheduled"],
    ["Quotation follow-up", "Rohan & Aditi Shah", "BT/QT/26-27/2064", "01 Aug 2026", "Email", "Scheduled"],
    ["Overdue escalation", "Aarav Textiles Pvt. Ltd.", "BT/PI/26-27/1186", "04 Aug 2026", "Email", "Draft"],
  ];
  return (
    <div>
      <PageHeader title="Reminders" description="Scheduled payment, quotation, and overdue follow-ups." action={<button className={primaryButton}><Plus className="h-4 w-4" /> New reminder</button>} />
      <div className="mb-5 grid overflow-hidden rounded-lg border border-slate-200 bg-white sm:grid-cols-3"><Kpi label="Scheduled" value="2" detail="Next 7 days" /><Kpi label="Sent this month" value="14" detail="Email and WhatsApp" /><Kpi label="Needs review" value="1" detail="Draft escalation" tone="warning" /></div>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Reminder</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Document</th><th className="px-4 py-3">Send on</th><th className="px-4 py-3">Channel</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row[2]}><td className="px-4 py-3 font-medium text-primary">{row[0]}</td><td className="px-4 py-3">{row[1]}</td><td className="px-4 py-3 text-xs text-slate-600">{row[2]}</td><td className="px-4 py-3">{row[3]}</td><td className="px-4 py-3">{row[4]}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600"><BellRing className="h-3.5 w-3.5" /> {row[5]}</span></td></tr>)}</tbody></table></section>
    </div>
  );
}

export function FinanceSettings() {
  return (
    <div>
      <PageHeader title="Finance settings" description="Legal identity, numbering, tax, payment, and document defaults." action={<button className={primaryButton}><Check className="h-4 w-4" /> Save settings</button>} />
      <div className="space-y-6">
        <SectionCard title="Business identity" description="Printed on all customer and statutory documents.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Legal business name" required><input className={fieldClass} defaultValue="Bandhan Tours Private Limited" /></Field>
            <Field label="Trade name"><input className={fieldClass} defaultValue="Bandhan Tours" /></Field>
            <Field label="GSTIN" required><input className={fieldClass} placeholder="27ABCDE1234F1Z5" maxLength={15} /></Field>
            <Field label="PAN" required><input className={fieldClass} placeholder="ABCDE1234F" maxLength={10} /></Field>
            <Field label="CIN"><input className={fieldClass} placeholder="U63000MH…" /></Field>
            <Field label="State code" required><input className={fieldClass} defaultValue="27" /></Field>
            <div className="sm:col-span-2"><Field label="Registered address" required><textarea className={textareaClass} placeholder="Street, city, state, PIN, India" /></Field></div>
            <Field label="Finance email" required><input type="email" className={fieldClass} defaultValue="accounts@bandhantours.com" /></Field>
          </div>
        </SectionCard>
        <SectionCard title="Document numbering" description="Separate, continuous series for each statutory document type.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Quotation series"><input className={fieldClass} defaultValue="BT/QT/{FY}/{SEQ}" /></Field>
            <Field label="Proforma series"><input className={fieldClass} defaultValue="BT/PI/{FY}/{SEQ}" /></Field>
            <Field label="Invoice series"><input className={fieldClass} defaultValue="BT/INV/{FY}/{SEQ}" /></Field>
            <Field label="Credit note series"><input className={fieldClass} defaultValue="BT/CN/{FY}/{SEQ}" /></Field>
          </div>
        </SectionCard>
        <SectionCard title="Tax and payment defaults">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Default SAC"><input className={fieldClass} defaultValue="998555" /></Field>
            <Field label="Default GST rate"><select className={fieldClass} defaultValue="5"><option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option></select></Field>
            <Field label="Default payment term"><select className={fieldClass}><option>Due in 10 days</option><option>Due in 7 days</option><option>Due in 15 days</option><option>Due on receipt</option></select></Field>
            <Field label="Beneficiary name"><input className={fieldClass} defaultValue="Bandhan Tours Private Limited" /></Field>
            <Field label="Bank account number"><input className={fieldClass} placeholder="Account number" /></Field>
            <Field label="IFSC"><input className={fieldClass} placeholder="ABCD0123456" /></Field>
            <Field label="Bank name / branch"><input className={fieldClass} placeholder="Bank and branch" /></Field>
            <Field label="UPI ID"><input className={fieldClass} placeholder="accounts@upi" /></Field>
            <Field label="Invoice declaration"><input className={fieldClass} defaultValue="We declare that this invoice shows the actual price of the services described." /></Field>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
