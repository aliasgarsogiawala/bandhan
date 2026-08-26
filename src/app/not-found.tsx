import Link from "next/link";
import PageShell from "@/components/ui/PageShell";

const routes = [
  { href: "/packages", label: "Tour packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/blog", label: "Travel blog" },
  { href: "/contact", label: "Contact us" },
];

export default function NotFound() {
  return (
    <PageShell
      tone="sand"
      offsetTop
      mainClassName="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      <span className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
        404 — Off the map
      </span>
      <h1 className="max-w-xl font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-foreground-muted sm:text-base">
        The link may be out of date, or the page may have moved. Here is where
        most travellers are headed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="inline-flex items-center rounded-full border border-primary/25 bg-white px-6 py-3 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary hover:text-white"
          >
            {route.label}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
