"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import PageShell from "@/components/ui/PageShell";
import PageHero from "@/components/ui/PageHero";
import { useCollection } from "@/lib/admin/store";
import type { BlogPost } from "@/lib/admin/types";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { fuzzySearch } from "@/lib/fuzzySearch";
import { placeholderImage } from "@/lib/placeholderImages";

const ALL = "All";

export const BlogListClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, ready } = useCollection<BlogPost>("blog");
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const published = useMemo(() => items.filter((p) => p.isPublished), [items]);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(published.map((p) => p.category).filter(Boolean)))],
    [published]
  );

  const searchedPosts = fuzzySearch(published, query, ["title", "excerpt", "content", "category", "author"]);

  const visible = searchedPosts.filter((p) => activeCategory === ALL || p.category === activeCategory);

  const postHref = (post: BlogPost) => `/blog/${post.slug || post.id}`;

  return (
    <PageShell tone="sand" onEnquiryClick={() => router.push(contactEnquiryHref(""))}>
      <PageHero
        size="lg"
        priority
        eyebrow="Blog"
        title={
          <>
            Travel stories & <span className="text-gold">guides</span>
          </>
        }
        description="Field notes, seasonal guides, and honest advice from the designers who plan our journeys — everything we learn on the road, shared with you."
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200"
        imageAlt=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        toolbar={
          <>
            {/* Search box */}
            <div className="relative max-w-md">
              <label className="sr-only" htmlFor="blog-search">
                Search articles
              </label>
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                id="blog-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles by title or topic…"
                className="min-h-12 w-full rounded-full border border-white/15 bg-white/10 py-3 pl-11 pr-10 text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold sm:text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category filter */}
            {categories.length > 1 && (
              <div className="inline-flex max-w-full flex-wrap gap-1 p-1 bg-white/10 backdrop-blur-md rounded-3xl sm:rounded-full border border-white/15 mt-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-11 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 sm:px-6 ${
                      activeCategory === cat
                        ? "bg-gold text-primary shadow-md"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </>
        }
      />

      {/* Posts grid */}
      <section className="bg-sand-bg/40 py-16 sm:py-20">
        <Container>
          {ready && visible.length === 0 ? (
            <p className="text-center text-foreground-muted py-16">
              {query
                ? `No articles match "${query}".`
                : "No articles here yet — check back soon for fresh travel stories."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((post, index) => (
                <ScrollReveal key={post.id} delay={(index % 3) * 100}>
                  <Link
                    href={postHref(post)}
                    className="group bg-white overflow-hidden shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full border border-slate-100/50"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.coverImage || placeholderImage(post.id)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-gold text-primary text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-foreground-muted mb-2.5">
                        <span>{post.date}</span>
                        {post.readTime && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-foreground-light" />
                            <span>{post.readTime}</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-lg font-heading font-bold text-primary leading-snug group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm text-foreground-muted leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        Read article
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </PageShell>
  );
};

export default BlogListClient;
