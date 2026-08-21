import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Bus,
  CalendarCheck,
  Check,
  ChevronDown,
  ClipboardList,
  FileCheck2,
  Headphones,
  MapPin,
  Plane,
  Presentation,
  Receipt,
  ShieldCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import MiceHero from "@/components/mice/MiceHero";
import MiceEnquiryForm from "@/components/mice/MiceEnquiryForm";

export const metadata: Metadata = {
  title: "Corporate & MICE Travel | Bandhan Tours",
  description:
    "End-to-end meetings, incentives, conferences and exhibitions management by Bandhan Tours, including travel, venues, delegate operations and on-site delivery.",
  alternates: { canonical: "/mice" },
};

const companyFacts = [
  { value: "13+ years", label: "Corporate travel experience" },
  { value: "3 offices", label: "Thane, Pune and Guwahati" },
  { value: "India + global", label: "Domestic and international programmes" },
  { value: "One team", label: "From proposal to reconciliation" },
];

const programmeTypes = [
  {
    number: "01",
    title: "Meetings",
    copy: "Structured travel and venue support for leadership teams, sales reviews, training programmes and board meetings.",
    examples: ["Residential offsites", "Annual reviews", "Training programmes"],
  },
  {
    number: "02",
    title: "Incentives",
    copy: "Reward travel designed around recognition, hospitality and destination experiences for employees and channel partners.",
    examples: ["Performance rewards", "Partner programmes", "Family incentives"],
  },
  {
    number: "03",
    title: "Conferences",
    copy: "Coordinated delivery for conventions, dealer meetings and product launches with multiple delegate movements and sessions.",
    examples: ["Annual conventions", "Dealer meets", "Product launches"],
  },
  {
    number: "04",
    title: "Exhibitions",
    copy: "Travel, accommodation and ground support for exhibiting teams, hosted buyers and trade-fair delegations.",
    examples: ["Trade-fair travel", "Hosted buyers", "Stand crew logistics"],
  },
];

const capabilityGroups = [
  {
    icon: Plane,
    title: "Travel and accommodation",
    copy: "Commercially sound group movement with a single view of every traveller.",
    items: [
      "Group airfares and booking controls",
      "Venue and hotel sourcing",
      "Rooming lists and accommodation management",
      "Visa, insurance and documentation support",
      "Airport transfers and coach operations",
    ],
  },
  {
    icon: Presentation,
    title: "Event and hospitality",
    copy: "The physical event environment, planned around the programme objective and brand.",
    items: [
      "Meeting rooms and seating plans",
      "AV, stage and production coordination",
      "Branding, signage and delegate kits",
      "Menus, dietary requirements and banquets",
      "Team activities and destination experiences",
    ],
  },
  {
    icon: ClipboardList,
    title: "Delegate operations",
    copy: "Detailed pre-event preparation and accountable on-site management.",
    items: [
      "Registration and delegate communication",
      "Live manifests and arrival tracking",
      "VIP and speaker handling",
      "On-site help desk and escalation support",
      "Post-event reconciliation and reporting",
    ],
  },
];

const managementControls = [
  {
    icon: Users,
    title: "Single-point ownership",
    copy: "One programme manager maintains context, approvals and accountability from the first brief onward.",
  },
  {
    icon: Receipt,
    title: "Budget transparency",
    copy: "Itemised proposals, defined payment milestones and a closing reconciliation against approved costs.",
  },
  {
    icon: ShieldCheck,
    title: "Duty of care",
    copy: "Vetted suppliers, delegate records and escalation plans appropriate to the destination and group profile.",
  },
  {
    icon: FileCheck2,
    title: "Operational reporting",
    copy: "Rooming, travel and service trackers that give internal stakeholders a clear programme status.",
  },
];

const corporateSolutions = [
  {
    icon: Building2,
    title: "Hotel reservations",
    copy: "Corporate hotel bookings at preferred rates across India and international destinations.",
  },
  {
    icon: Users,
    title: "Corporate and group travel",
    copy: "Seamless management of individual and group business travel itineraries.",
  },
  {
    icon: Presentation,
    title: "MICE services",
    copy: "Full support for meetings, incentives, conferences and exhibitions.",
  },
  {
    icon: FileCheck2,
    title: "Visa and passport assistance",
    copy: "Expert guidance and documentation support for international travel compliance.",
  },
  {
    icon: Bus,
    title: "Ground transportation",
    copy: "Reliable airport transfers and local transport arrangements for your teams.",
  },
  {
    icon: Headphones,
    title: "24×7 travel support",
    copy: "Round-the-clock assistance ensuring your travellers are never left stranded.",
  },
];

const travellerExperience = [
  {
    icon: CalendarCheck,
    title: "Quick confirmations",
    copy: "Fast booking confirmations so your teams can focus on business, not logistics.",
  },
  {
    icon: ClipboardList,
    title: "Customised solutions",
    copy: "Travel policies and itineraries tailored to your organisation's specific needs.",
  },
  {
    icon: Headphones,
    title: "Reliable support",
    copy: "24×7 dedicated assistance for any travel disruption or last-minute change.",
  },
];

const clients = [
  { name: "ABEC Exhibitions & Conferences Pvt. Ltd.", logo: "/clients/abec.png" },
  { name: "Krypton", logo: "/clients/krypton.png" },
  { name: "Bandhan Industries", logo: "/clients/bandhan-industries.png" },
  { name: "Antyodaya", logo: "/clients/antyodaya.png" },
];

const serviceIcons = [Building2, Plane, Bus, FileCheck2, UtensilsCrossed, Headphones];

const process = [
  {
    step: "01",
    title: "Brief and objectives",
    copy: "We establish the programme purpose, delegate profile, dates, location preferences and budget parameters.",
  },
  {
    step: "02",
    title: "Options and costing",
    copy: "You receive a considered shortlist of destinations, venues and programme formats with itemised indicative costs.",
  },
  {
    step: "03",
    title: "Contract and planning",
    copy: "Once approved, we secure inventory, confirm suppliers and build the working timeline, rooming and movement plans.",
  },
  {
    step: "04",
    title: "Delegate readiness",
    copy: "Registration, documentation, communications and final manifests are checked before the group travels.",
  },
  {
    step: "05",
    title: "Delivery and close-out",
    copy: "Our on-site team manages the programme, followed by supplier settlement and final cost reconciliation.",
  },
];

const faqs = [
  {
    question: "What size of corporate group can Bandhan Tours manage?",
    answer:
      "We plan focused leadership groups as well as larger conventions and dealer programmes. The operating team, venue plan and transport structure are scaled to the delegate count and programme complexity.",
  },
  {
    question: "How long does a MICE proposal take?",
    answer:
      "The corporate desk acknowledges a brief within one working day. A costed proposal usually takes two to three working days, depending on the number of live hotel, air and supplier quotations required.",
  },
  {
    question: "Can you manage international group visas?",
    answer:
      "Yes. We coordinate application requirements, invitation and sponsorship documents, insurance and submission tracking. Final approval remains with the relevant embassy or consulate.",
  },
  {
    question: "Will Bandhan Tours have a team at the event?",
    answer:
      "Yes. For managed MICE programmes, the required number of Bandhan representatives travels with the group or is positioned on site based on delegate count and programme spread.",
  },
  {
    question: "Can you work with an event agency or venue we already use?",
    answer:
      "Yes. We can take responsibility for travel, accommodation, visas and delegate logistics while coordinating with your appointed production agency, venue or internal events team.",
  },
  {
    question: "What is required to start a proposal?",
    answer:
      "An approximate delegate count, event type, preferred travel window and budget range are enough to begin. A complete RFP can follow once the initial direction is agreed.",
  },
];

export default function MicePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <MiceHero />

      <main>
        <section className="border-b border-primary/10 py-20 sm:py-24 lg:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <ScrollReveal className="lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  An integrated approach
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-primary sm:text-4xl">
                  One partner for the event and every journey around it.
                </h2>
              </ScrollReveal>
              <ScrollReveal className="lg:col-span-7">
                <div className="space-y-5 text-base leading-8 text-foreground-muted">
                  <p>
                    A successful corporate programme depends on more than the
                    meeting room. Flights, visas, hotel inventory, delegate
                    communications, transfers and production must operate against
                    one plan.
                  </p>
                  <p>
                    Bandhan Tours combines travel-management discipline with
                    event-delivery support. Your organisation has one programme
                    lead, one agreed scope and a clear line of accountability from
                    approval through final reconciliation.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <dl className="mt-14 grid grid-cols-2 border-l border-t border-primary/15 lg:grid-cols-4">
              {companyFacts.map((fact) => (
                <div key={fact.label} className="border-b border-r border-primary/15 p-5 sm:p-7">
                  <dt className="text-xs leading-5 text-foreground-muted">{fact.label}</dt>
                  <dd className="mt-2 font-heading text-xl font-bold text-primary sm:text-2xl">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <section className="bg-[#f5f5f2] py-20 sm:py-24 lg:py-28">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Corporate travel management
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                  End-to-end corporate travel solutions.
                </h2>
                <p className="mt-5 text-base leading-8 text-foreground-muted">
                  Bandhan Tours has served corporate clients across India for over
                  13 years, planning every business trip with efficiency,
                  professionalism and personalised support. MICE programmes sit
                  inside that wider service, so the event and the everyday travel
                  around it are handled by the same desk.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-12 grid border-l border-t border-primary/15 sm:grid-cols-2 lg:grid-cols-3">
              {corporateSolutions.map((solution) => (
                <ScrollReveal key={solution.title}>
                  <article className="h-full border-b border-r border-primary/15 bg-white p-7 sm:p-8">
                    <solution.icon size={22} className="text-accent" aria-hidden="true" />
                    <h3 className="mt-5 font-heading text-lg font-bold text-primary">{solution.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground-muted">{solution.copy}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-primary/10 py-20 sm:py-24 lg:py-28">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Meetings, incentives, conferences and exhibitions
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                  Different formats. The same standard of control.
                </h2>
                <p className="mt-5 text-base leading-8 text-foreground-muted">
                  Each format has a different purpose and operating requirement.
                  The programme is planned accordingly rather than adapted from a
                  standard tour itinerary.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-12 grid border-l border-t border-primary/15 md:grid-cols-2">
              {programmeTypes.map((programme) => (
                <ScrollReveal key={programme.title}>
                  <article className="h-full border-b border-r border-primary/15 bg-[#f5f5f2] p-7 sm:p-9">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-heading text-2xl font-bold text-primary">{programme.title}</h3>
                      <span className="text-xs font-bold text-accent">{programme.number}</span>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-foreground-muted">{programme.copy}</p>
                    <ul className="mt-7 space-y-3 border-t border-primary/10 pt-5">
                      {programme.examples.map((example) => (
                        <li key={example} className="flex items-center gap-3 text-sm font-medium text-primary/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="capabilities" className="scroll-mt-24 bg-primary py-20 text-white sm:py-24 lg:py-28">
          <Container>
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Scope of services</p>
                  <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.025em] sm:text-4xl">
                    The complete operating scope, under one team.
                  </h2>
                </div>
                <p className="max-w-xl text-base leading-8 text-white/65 lg:justify-self-end">
                  We agree responsibilities at proposal stage so your team knows
                  exactly what Bandhan owns, what requires approval and which
                  information is still outstanding.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-12 grid gap-px overflow-hidden border border-white/15 bg-white/15 lg:grid-cols-3">
              {capabilityGroups.map((group) => (
                <ScrollReveal key={group.title} className="bg-primary">
                  <article className="h-full p-7 sm:p-8">
                    <group.icon size={24} className="text-gold" aria-hidden="true" />
                    <h3 className="mt-6 font-heading text-xl font-bold">{group.title}</h3>
                    <p className="mt-3 min-h-14 text-sm leading-7 text-white/60">{group.copy}</p>
                    <ul className="mt-7 space-y-4 border-t border-white/15 pt-6">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-white/80">
                          <Check size={15} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[#f5f5f2] py-20 sm:py-24 lg:py-28">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Traveller experience
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                  Your teams travel with confidence.
                </h2>
              </div>
            </ScrollReveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {travellerExperience.map((item) => (
                <ScrollReveal key={item.title}>
                  <article className="h-full border-t-2 border-primary bg-white px-6 py-8">
                    <item.icon size={22} className="text-accent" aria-hidden="true" />
                    <h3 className="mt-5 font-heading text-lg font-bold text-primary">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground-muted">{item.copy}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <p className="mt-12 max-w-3xl border-l-2 border-accent pl-6 font-heading text-lg leading-9 text-primary sm:text-xl">
                We don&apos;t just manage trips. We work as a strategic extension of
                your procurement and HR teams, so every traveller is supported and
                every rupee is well spent.
              </p>
            </ScrollReveal>
          </Container>
        </section>

        <section className="border-b border-primary/10 py-20 sm:py-24 lg:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-16">
              <ScrollReveal className="relative min-h-[420px] overflow-hidden rounded-xl lg:min-h-[620px]">
                <Image
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=85&w=2000"
                  alt="Corporate delegates speaking during a conference networking session"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </ScrollReveal>

              <ScrollReveal className="lg:py-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Programme governance</p>
                <h2 className="mt-4 max-w-xl font-heading text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                  Clear control for the teams responsible for delivery.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-foreground-muted">
                  Corporate travel needs a creative experience for delegates and
                  disciplined management for HR, procurement and finance. The
                  operating model supports both.
                </p>

                <div className="mt-9 border-t border-primary/15">
                  {managementControls.map((control) => (
                    <article key={control.title} className="flex gap-4 border-b border-primary/15 py-6">
                      <control.icon size={21} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                      <div>
                        <h3 className="font-heading text-lg font-bold text-primary">{control.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-foreground-muted">{control.copy}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </section>

        <section className="bg-[#f5f5f2] py-20 sm:py-24 lg:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <ScrollReveal className="lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Destination planning</p>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                  Selected for the objective, access and budget.
                </h2>
                <p className="mt-5 text-base leading-8 text-foreground-muted">
                  Destination recommendations consider air access, hotel inventory,
                  seasonality, visa requirements, ground movement and the experience
                  the programme needs to create.
                </p>
                <div className="mt-8 flex items-start gap-3 rounded-lg border border-primary/15 bg-white p-5">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <p className="text-sm leading-7 text-foreground-muted">
                    Our Guwahati branch provides local support for Northeast India
                    programmes, alongside the Thane and Pune teams.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal className="lg:col-span-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      heading: "Within India",
                      destinations: ["Goa", "Udaipur and Jaipur", "Kerala", "Northeast India", "Rishikesh and Mussoorie", "Mumbai, Pune and Delhi NCR"],
                    },
                    {
                      heading: "International",
                      destinations: ["Dubai and Abu Dhabi", "Singapore and Malaysia", "Thailand", "Bali", "Vietnam", "Sri Lanka"],
                    },
                  ].map((group) => (
                    <div key={group.heading} className="border-t-2 border-primary bg-white px-6 py-7">
                      <h3 className="font-heading text-lg font-bold text-primary">{group.heading}</h3>
                      <ul className="mt-5 divide-y divide-primary/10">
                        {group.destinations.map((destination, index) => {
                          const DestinationIcon = serviceIcons[index % serviceIcons.length];
                          return (
                            <li key={destination} className="flex items-center gap-3 py-3 text-sm text-foreground-muted">
                              <DestinationIcon size={15} className="shrink-0 text-accent" aria-hidden="true" />
                              {destination}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </section>

        <section className="border-b border-primary/10 py-20 sm:py-24 lg:py-28">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Programme process</p>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                  A defined route from brief to close-out.
                </h2>
              </div>
            </ScrollReveal>

            <div className="mt-12 border-t border-primary/20">
              {process.map((item) => (
                <ScrollReveal key={item.step}>
                  <article className="grid gap-3 border-b border-primary/20 py-6 sm:grid-cols-[4rem_0.8fr_1.4fr] sm:items-start sm:gap-8 sm:py-8">
                    <span className="text-xs font-bold text-accent">{item.step}</span>
                    <h3 className="font-heading text-lg font-bold text-primary">{item.title}</h3>
                    <p className="max-w-2xl text-sm leading-7 text-foreground-muted">{item.copy}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-primary/10 py-16 sm:py-20">
          <Container>
            <ScrollReveal>
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our clientele</p>
                  <h2 className="mt-4 font-heading text-2xl font-bold tracking-[-0.025em] text-primary sm:text-3xl">
                    Trusted by organisations that travel often.
                  </h2>
                </div>
                <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4">
                  {clients.map((client) => (
                    <li key={client.name} className="relative h-14">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        sizes="(max-width: 640px) 40vw, 160px"
                        className="object-contain object-left grayscale transition duration-300 hover:grayscale-0 sm:object-center"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </Container>
        </section>

        <section id="enquiry" className="scroll-mt-24 bg-[#f5f5f2] py-20 sm:py-24 lg:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
              <ScrollReveal className="lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Request a proposal</p>
                <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-primary sm:text-4xl">
                  Share the requirement with our corporate desk.
                </h2>
                <p className="mt-5 text-base leading-8 text-foreground-muted">
                  An approximate delegate count, travel window and budget range are
                  enough for an initial assessment. We will contact you to clarify
                  the programme before preparing options.
                </p>

                <div className="mt-8 space-y-4 border-t border-primary/15 pt-7 text-sm">
                  <div className="flex gap-3">
                    <CalendarCheck size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <p className="leading-6 text-foreground-muted">Initial response within one working day.</p>
                  </div>
                  <div className="flex gap-3">
                    <Receipt size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <p className="leading-6 text-foreground-muted">Itemised proposal with clearly stated inclusions.</p>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <p className="leading-6 text-foreground-muted">No obligation — review the options and compare rates before committing.</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-primary/15 pt-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground-light">Corporate desk</p>
                  <p className="mt-3 font-heading text-lg font-bold text-primary">Nikita Patil</p>
                  <p className="text-sm text-foreground-muted">Corporate sales and operations</p>
                  <a href="tel:+919175685400" className="mt-4 block font-heading text-xl font-bold text-primary hover:text-accent">+91 91756 85400</a>
                  <a href="mailto:nikita@bandhantours.com" className="mt-1 block text-sm text-foreground-muted hover:text-accent">nikita@bandhantours.com</a>
                  <p className="mt-5 text-sm leading-6 text-foreground-muted">
                    Bandhan Tours Pvt. Ltd., Tower 2, Lodha Supremus, 226 Road No. 22,
                    Wagle Industrial Estate, Thane
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <MiceEnquiryForm />
              </ScrollReveal>
            </div>
          </Container>
        </section>

        <section className="py-20 sm:py-24 lg:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <ScrollReveal>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Frequently asked questions</p>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                  Practical information before you begin.
                </h2>
              </ScrollReveal>

              <div className="border-t border-primary/15">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group border-b border-primary/15">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left font-heading text-base font-semibold text-primary marker:content-none">
                      {faq.question}
                      <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-foreground-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-primary py-16 text-white sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Corporate meetings and events</p>
                <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold sm:text-4xl">
                  Start with the objective. We will build the programme around it.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#enquiry" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark">
                  Request a proposal <ArrowRight size={16} aria-hidden="true" />
                </a>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-primary">
                  Contact Bandhan Tours
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
