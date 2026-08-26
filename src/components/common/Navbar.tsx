"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, MapPin, Newspaper, ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/lib/auth/useAuth";
import { useRecentSearches } from "@/lib/recentSearches";
import { useCollection } from "@/lib/admin/store";
import type { TourPackage } from "@/data/mockData";
import type { BlogPost } from "@/lib/admin/types";
import { fuzzySearch } from "@/lib/fuzzySearch";

interface Suggestion {
  key: string;
  kind: "package" | "post";
  title: string;
  subtitle: string;
  image?: string;
  href: string;
}

function useSearchSuggestions(query: string, limit = 6): Suggestion[] {
  const { items: packages } = useCollection<TourPackage>("packages");
  const { items: posts } = useCollection<BlogPost>("blog");

  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const activePackages = packages.filter((p) => p.status !== "draft");
    const publishedPosts = posts.filter((p) => p.isPublished);

    const packageMatches = fuzzySearch(activePackages, trimmed, [
      "title",
      "category",
      "tagline",
      "highlights",
      "themes",
    ]).slice(0, 4);

    const postMatches = fuzzySearch(publishedPosts, trimmed, [
      "title",
      "excerpt",
      "category",
    ]).slice(0, 3);

    const packageSuggestions: Suggestion[] = packageMatches.map((pkg) => ({
      key: `package-${pkg.id}`,
      kind: "package",
      title: pkg.title,
      subtitle: `${pkg.category} · ${pkg.duration}`,
      image: pkg.image,
      href: `/packages/${pkg.id}`,
    }));

    const postSuggestions: Suggestion[] = postMatches.map((post) => ({
      key: `post-${post.id}`,
      kind: "post",
      title: post.title,
      subtitle: post.category || "Travel guide",
      image: post.coverImage,
      href: `/blog/${post.slug || post.id}`,
    }));

    return [...packageSuggestions, ...postSuggestions].slice(0, limit);
  }, [query, packages, posts, limit]);
}

interface NavbarProps {
  onEnquiryClick?: () => void;
  /**
   * Paint the bar solid before any scrolling. Pages that open on a light
   * surface rather than a dark hero need this for the links to stay legible.
   */
  solidAtTop?: boolean;
}

const PACKAGE_GROUPS = [
  {
    heading: "Northeast India",
    items: [
      { label: "Assam, Meghalaya & Arunachal", href: "/packages/3-sisters-tour" },
      { label: "Nagaland, Manipur, Tripura & Mizoram", href: "/packages/4-sisters-tour" },
      { label: "Sikkim & Darjeeling — 7 Days", href: "/packages/sikkim-darjeeling-6n" },
      { label: "Sikkim, Lachung & Darjeeling — 10 Days", href: "/packages/sikkim-darjeeling-9n" },
    ],
  },
  {
    heading: "Domestic",
    items: [
      { label: "Andaman Tour", href: "/packages/andaman-tour" },
      { label: "Andaman with Baratang", href: "/packages/andaman-baratang-tour" },
      { label: "Ayodhya & Varanasi", href: "/packages/ayodhya-varanasi" },
      { label: "Kerala & Kanyakumari", href: "/packages/kerala-kanyakumari" },
      { label: "Rajasthan Marwad", href: "/packages/rajasthan-marwad" },
      { label: "Sampurna Karnataka", href: "/packages/sampurna-karnataka" },
      { label: "South India Temple Tour", href: "/packages/south-india-temple-tour" },
      { label: "Special Kerala", href: "/packages/special-kerala" },
    ],
  },
  {
    heading: "International",
    items: [
      { label: "Bali — Island of Dreams", href: "/packages/bali-island-dreams" },
      { label: "Amazing Thailand", href: "/packages/amazing-thailand" },
      { label: "Singapore, Malaysia & Thailand", href: "/packages/singapore-malaysia-thailand" },
      { label: "Mesmerizing Vietnam", href: "/packages/mesmerizing-vietnam" },
      { label: "Bhutan Tour", href: "/packages/bhutan-tour" },
      { label: "Best of Europe", href: "/packages/best-of-europe-2027" },
      { label: "Japan Autumn Delights", href: "/packages/japan-autumn-delights" },
      { label: "Scandinavia & Northern Lights", href: "/packages/scandinavia-northern-lights" },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onEnquiryClick, solidAtTop: forceSolid = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isMobilePackagesOpen, setIsMobilePackagesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(-1);

  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // `/mice` opens on its own light editorial hero; every other light-topped
  // page tells us so through the shell's `solidAtTop` prop.
  const solidAtTop = forceSolid || pathname === "/mice";
  const openEnquiry = onEnquiryClick || (() => router.push("/contact"));
  const { items: recentSearches, saveRecentSearch, clearRecentSearches } = useRecentSearches();
  const suggestions = useSearchSuggestions(searchQuery);
  const mobileSuggestions = useSearchSuggestions(mobileSearchQuery);

  const packagesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const runSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    saveRecentSearch({ label: trimmed });
    router.push(`/packages?search=${encodeURIComponent(trimmed)}`);
  };

  const goToSuggestion = (suggestion: Suggestion) => {
    saveRecentSearch({ label: suggestion.title });
    router.push(suggestion.href);
  };

  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    list: Suggestion[],
    index: number,
    setIndex: (i: number) => void,
    query: string,
    onDone: () => void
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (list.length) setIndex(Math.min(index + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (list.length) setIndex(Math.max(index - 1, -1));
    } else if (e.key === "Escape") {
      onDone();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (index >= 0 && list[index]) {
        goToSuggestion(list[index]);
      } else {
        runSearch(query);
      }
      onDone();
    }
  };

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsMobileProfileOpen(false);
    await signOut();
    router.refresh();
  };

  const firstName = user?.name?.split(" ")[0] || "";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (packagesRef.current && !packagesRef.current.contains(target)) {
        setIsPackagesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(target)) {
        setIsMobileProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Group Tours", href: "/#group-departures" },
    { label: "Plan a Custom Trip", href: "/plan-trip" },
    { label: "Corporate / MICE", href: "/mice" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const toggleMobileProfile = () => {
    setIsMobileProfileOpen((prev) => !prev);
  };

  return (
    <>
      <nav
        className="fixed left-0 top-0 z-[45] w-full px-3 sm:px-4"
      >
        <Container
          clean
          className={`mt-3 flex max-w-[92rem] items-center justify-between rounded-xl border px-4 py-3 transition-all duration-300 sm:px-5 ${
            isScrolled || solidAtTop
              ? "border-white/10 bg-primary/95 shadow-[0_14px_40px_-22px_rgba(3,12,23,0.8)] backdrop-blur-xl"
              : "border-white/15 bg-ink-deep/40 shadow-[0_14px_40px_-26px_rgba(3,12,23,0.75)] backdrop-blur-md"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Bandhan Tours home"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(false);
            }}
            className="relative z-50 flex items-center shrink-0"
          >
            <Image
              src="/logo.svg"
              alt="Bandhan Tours"
              width={150}
              height={55}
              priority
              className="h-9 w-auto object-contain transition-all duration-300 sm:h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 xl:flex 2xl:gap-7">
            {/* Home Link */}
            <Link
              href="/"
              className="text-sm font-medium tracking-wide text-white/85 hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </Link>

            {/* Packages Dropdown Trigger & Menu */}
            <div
              className="relative py-1"
              ref={packagesRef}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsPackagesOpen(false);
                }
              }}
            >
              <button
                onClick={() => setIsPackagesOpen((open) => !open)}
                aria-expanded={isPackagesOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors duration-300 focus:outline-none relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-gold after:transition-all after:duration-300 ${
                  isPackagesOpen
                    ? "text-gold after:w-full"
                    : "text-white/85 hover:text-gold after:w-0 hover:after:w-full"
                }`}
              >
                Packages
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${
                    isPackagesOpen ? "rotate-180 text-gold" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Destination mega menu — grouped to match the live Bandhan navigation. */}
              {/*
                The closed panel keeps its layout box (`invisible`, so the open
                transition has something to animate from), and that box is over
                a thousand pixels wide. Without `pointer-events-none` the
                wrapper silently swallows every click landing in the top-left of
                the page beneath it.
              */}
              <div
                className="pointer-events-none absolute left-[-10.5rem] top-full w-[min(1120px,calc(100vw-3rem))] pt-4"
              >
                <div
                  className={`overflow-hidden rounded-b-3xl rounded-t-md border border-slate-200 border-r-4 border-r-accent bg-white shadow-[0_26px_70px_-22px_rgba(3,16,32,0.35)] transition-all duration-300 origin-top-left ${
                  isPackagesOpen
                    ? "pointer-events-auto opacity-100 translate-y-0 visible"
                    : "pointer-events-none invisible -translate-y-2 opacity-0"
                }`}
                >
                  <div className="grid grid-cols-3 px-7 py-8">
                    {PACKAGE_GROUPS.map((group, groupIndex) => (
                      <section
                        key={group.heading}
                        className={`min-w-0 px-7 ${groupIndex === 0 ? "pl-1" : "border-l border-slate-200"}`}
                        aria-labelledby={`desktop-package-group-${groupIndex}`}
                      >
                        <h3
                          id={`desktop-package-group-${groupIndex}`}
                          className="font-heading text-base font-bold text-primary"
                        >
                          {group.heading}
                        </h3>
                        <ul className="mt-4 space-y-0.5">
                          {group.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setIsPackagesOpen(false);
                                }}
                                className="group/item flex min-h-9 items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-sand-light hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                              >
                                <span>{item.label}</span>
                                <ArrowRight
                                  size={13}
                                  className="shrink-0 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                                  aria-hidden="true"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-6 border-t border-slate-200 bg-sand-light px-8 py-4">
                    <p className="text-xs font-medium text-foreground-muted">
                      Not sure where to begin? Browse the complete collection.
                    </p>
                    <Link
                      href="/packages"
                      onClick={() => {
                        setIsPackagesOpen(false);
                      }}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent"
                    >
                      View all packages <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Navigation Links */}
            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium tracking-wide text-white/85 hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Call to action & account */}
          <div className="hidden shrink-0 items-center gap-3 xl:flex 2xl:gap-4">
            {/* Quick search */}
            <div className="relative flex items-center" ref={searchRef}>
              <div
                className={`absolute right-0 top-[calc(100%+1rem)] w-80 origin-top-right rounded-lg border border-white/10 bg-primary/98 p-2 shadow-premium backdrop-blur-xl transition-all duration-200 ${
                  isSearchOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible pointer-events-none -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (activeIndex >= 0 && suggestions[activeIndex]) {
                      goToSuggestion(suggestions[activeIndex]);
                    } else {
                      runSearch(searchQuery);
                    }
                    setIsSearchOpen(false);
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setActiveIndex(-1);
                    }}
                    onKeyDown={(e) =>
                      handleSearchKeyDown(
                        e,
                        suggestions,
                        activeIndex,
                        setActiveIndex,
                        searchQuery,
                        () => setIsSearchOpen(false)
                      )
                    }
                    placeholder="Search packages, destinations…"
                    aria-label="Search packages and destinations"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={isSearchOpen}
                    aria-autocomplete="list"
                    aria-controls="desktop-search-suggestions"
                    className="min-h-11 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </form>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isSearchOpen) {
                    setSearchQuery("");
                    setActiveIndex(-1);
                  }
                  setIsSearchOpen((prev) => !prev);
                }}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                className="p-2 text-white/85 hover:text-gold transition-colors duration-300 focus:outline-none"
              >
                {isSearchOpen ? <X size={19} /> : <Search size={19} />}
              </button>

              {/* Search dropdown: live suggestions or recent searches */}
              <div
                id="desktop-search-suggestions"
                className={`absolute right-0 top-[calc(100%+4.75rem)] w-80 max-h-[28rem] origin-top-right overflow-y-auto rounded-lg border border-white/10 bg-primary/98 p-2 shadow-premium backdrop-blur-xl transition-all duration-200 ${
                  isSearchOpen && (searchQuery.trim() || recentSearches.length > 0)
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                }`}
              >
                {searchQuery.trim() ? (
                  suggestions.length > 0 ? (
                    <>
                      <span className="block px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                        Suggestions
                      </span>
                      {suggestions.map((item, index) => (
                        <button
                          key={item.key}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => {
                            goToSuggestion(item);
                            setIsSearchOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                            index === activeIndex ? "bg-gold text-primary" : "text-white/85 hover:bg-white/10"
                          }`}
                        >
                          <span className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                            {item.image ? (
                              <Image src={item.image} alt="" fill className="object-cover" sizes="40px" />
                            ) : (
                              <span className="flex items-center justify-center w-full h-full">
                                {item.kind === "package" ? (
                                  <MapPin size={16} className="opacity-60" />
                                ) : (
                                  <Newspaper size={16} className="opacity-60" />
                                )}
                              </span>
                            )}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-semibold truncate">{item.title}</span>
                            <span
                              className={`block text-xs truncate ${
                                index === activeIndex ? "text-primary/70" : "text-white/50"
                              }`}
                            >
                              {item.subtitle}
                            </span>
                          </span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          runSearch(searchQuery);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 mt-1 rounded-xl text-sm font-semibold text-gold hover:bg-white/10 transition-all duration-150 border-t border-white/10"
                      >
                        View all results for &ldquo;{searchQuery.trim()}&rdquo;
                        <ArrowRight size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        runSearch(searchQuery);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 transition-all duration-150"
                    >
                      No quick matches — search &ldquo;{searchQuery.trim()}&rdquo; anyway
                      <ArrowRight size={14} className="shrink-0" />
                    </button>
                  )
                ) : (
                  <>
                    <div className="flex items-center justify-between px-3 py-1.5 mb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                        Recent searches
                      </span>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[11px] font-semibold text-white/50 hover:text-gold transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          runSearch(item.label);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/85 hover:text-primary hover:bg-gold transition-all duration-200 text-left"
                      >
                        <Clock size={14} className="shrink-0 opacity-60" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  className="flex items-center focus:outline-none relative transition-transform duration-300 hover:scale-105"
                  aria-label="Toggle profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gold text-primary flex items-center justify-center text-sm font-bold uppercase shadow-soft border-2 border-white/20 hover:border-gold transition-colors duration-300">
                    {firstName.charAt(0) || "U"}
                  </div>
                </button>

                {/* Profile Dropdown Panel */}
                <div
                  className={`absolute right-0 mt-3 w-64 rounded-2xl bg-primary/95 backdrop-blur-md border border-white/10 shadow-premium p-3 transition-all duration-300 origin-top-right ${
                    isProfileOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-2 border-b border-white/10 mb-2">
                    <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                      Logged In As
                    </p>
                    <p className="text-sm font-bold text-gold truncate mt-0.5">
                      Hi, {user.name || "User"}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-accent/25 transition-all duration-200 text-left cursor-pointer focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                className="text-sm font-medium tracking-wide text-white/85 hover:text-gold transition-colors duration-300"
              >
                Sign In
              </Link>
            )}
            <PrimaryButton
              variant="coral"
              size="sm"
              onClick={openEnquiry}
              className="shrink-0 !rounded-lg"
            >
              Enquire Now
            </PrimaryButton>
          </div>

          {/* Mobile Actions Container (Avatar & Hamburger) */}
          <div className="relative z-50 flex items-center gap-3 xl:hidden">
            {user && (
              <div className="relative" ref={mobileProfileRef}>
                <button
                  onClick={toggleMobileProfile}
                  aria-expanded={isMobileProfileOpen}
                  aria-haspopup="true"
                  className="flex items-center focus:outline-none transition-transform duration-300 hover:scale-105"
                  aria-label="Toggle profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gold text-primary flex items-center justify-center text-sm font-bold uppercase shadow-soft border-2 border-white/20">
                    {firstName.charAt(0) || "U"}
                  </div>
                </button>

                {/* Mobile Profile Dropdown Panel */}
                <div
                  className={`absolute right-0 mt-3 w-56 rounded-2xl bg-primary/98 backdrop-blur-lg border border-white/10 shadow-premium p-3 transition-all duration-300 origin-top-right ${
                    isMobileProfileOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                  }`}
                >
                  <div className="px-3 py-1.5 border-b border-white/10 mb-2">
                    <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">
                      Logged In As
                    </p>
                    <p className="text-sm font-bold text-gold truncate">
                      Hi, {user.name || "User"}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-accent/25 transition-all duration-200 text-left focus:outline-none cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Hamburger menu trigger */}
            <button
              ref={mobileMenuButtonRef}
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMobileProfileOpen(false);
              }}
              className="flex h-11 w-11 items-center justify-center text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              type="button"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Navigation Drawer */}
        <div
          id="mobile-navigation"
          aria-hidden={!isMobileMenuOpen}
          className={`fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-hidden bg-primary/98 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,calc(4.5rem+env(safe-area-inset-top)))] transition-all duration-300 ease-out xl:hidden ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="chatbot-scrollbar-none mx-auto flex min-h-0 w-full max-w-sm flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain py-3 text-left">
            {/* Mobile search */}
            <div className="mb-2 w-full text-left">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (mobileActiveIndex >= 0 && mobileSuggestions[mobileActiveIndex]) {
                    setIsMobileMenuOpen(false);
                    goToSuggestion(mobileSuggestions[mobileActiveIndex]);
                  } else {
                    setIsMobileMenuOpen(false);
                    runSearch(mobileSearchQuery);
                  }
                }}
                className="flex min-h-12 w-full items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5"
              >
                <Search size={17} className="text-white/60 shrink-0" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => {
                    setMobileSearchQuery(e.target.value);
                    setMobileActiveIndex(-1);
                  }}
                  onKeyDown={(e) =>
                    handleSearchKeyDown(
                      e,
                      mobileSuggestions,
                      mobileActiveIndex,
                      setMobileActiveIndex,
                      mobileSearchQuery,
                      () => {}
                    )
                  }
                  placeholder="Search packages, destinations…"
                  aria-label="Search packages and destinations"
                  autoComplete="off"
                  className="w-full bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none"
                />
              </form>

              {mobileSearchQuery.trim() && mobileSuggestions.length > 0 && (
                <div className="mt-2 rounded-2xl bg-white/5 border border-white/10 p-1.5">
                  {mobileSuggestions.map((item, index) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        goToSuggestion(item);
                      }}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors ${
                        index === mobileActiveIndex ? "bg-gold text-primary" : "text-white/85"
                      }`}
                    >
                      <span className="relative shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-white/10">
                        {item.image ? (
                          <Image src={item.image} alt="" fill className="object-cover" sizes="36px" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full">
                            {item.kind === "package" ? (
                              <MapPin size={14} className="opacity-60" />
                            ) : (
                              <Newspaper size={14} className="opacity-60" />
                            )}
                          </span>
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold truncate">{item.title}</span>
                        <span
                          className={`block text-xs truncate ${
                            index === mobileActiveIndex ? "text-primary/70" : "text-white/50"
                          }`}
                        >
                          {item.subtitle}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {!mobileSearchQuery.trim() && recentSearches.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  {recentSearches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        runSearch(item.label);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/75 hover:text-gold hover:border-gold/40 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Home link */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-4 font-heading text-xl font-bold text-white/90 transition-colors duration-300 hover:bg-white/[0.06] hover:text-gold"
            >
              Home
            </Link>

            {/* Mobile Packages Collapsible Trigger & Submenu */}
            <div className="flex flex-col items-stretch">
              <button
                onClick={() => setIsMobilePackagesOpen(!isMobilePackagesOpen)}
                className="flex min-h-11 w-full items-center justify-between rounded-xl px-4 font-heading text-xl font-bold text-white/90 transition-colors duration-300 hover:bg-white/[0.06] hover:text-gold focus:outline-none"
                aria-expanded={isMobilePackagesOpen}
                aria-controls="mobile-package-links"
                type="button"
              >
                Packages
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${
                    isMobilePackagesOpen ? "rotate-180 text-gold" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                id="mobile-package-links"
                className={`overflow-hidden transition-all duration-300 ${
                  isMobilePackagesOpen
                    ? "max-h-[1600px] opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <div className="mx-3 mt-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                  {PACKAGE_GROUPS.map((group, groupIndex) => (
                    <section
                      key={group.heading}
                      className={groupIndex > 0 ? "mt-5 border-t border-white/10 pt-5" : ""}
                      aria-labelledby={`mobile-package-group-${groupIndex}`}
                    >
                      <h3
                        id={`mobile-package-group-${groupIndex}`}
                        className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold"
                      >
                        {group.heading}
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-x-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex min-h-10 items-center rounded-lg px-2 py-2 text-sm font-medium leading-5 text-white/75 transition-colors hover:bg-white/[0.07] hover:text-gold"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                  <Link
                    href="/packages"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-5 flex min-h-11 items-center justify-between rounded-lg bg-gold px-4 text-sm font-bold text-primary"
                  >
                    View all packages <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Other standard navlinks */}
            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-4 font-heading text-xl font-bold text-white/90 transition-colors duration-300 hover:bg-white/[0.06] hover:text-gold"
              >
                {link.label}
              </a>
            ))}

            {/* If logged out, show Sign In */}
            {!user && (
              <Link
                href="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-4 font-heading text-xl font-bold text-white/90 transition-colors duration-300 hover:bg-white/[0.06] hover:text-gold"
              >
                Sign In
              </Link>
            )}

            {/* Enquire Now Action Button */}
            <div className="flex justify-center px-2 pt-3">
              <PrimaryButton
                variant="coral"
                size="lg"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openEnquiry();
                }}
                className="w-full max-w-[280px]"
              >
                Enquire Now
              </PrimaryButton>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
