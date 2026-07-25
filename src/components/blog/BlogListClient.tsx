"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useCollection } from "@/lib/admin/store";
import type { BlogPost } from "@/lib/admin/types";
import { contactEnquiryHref } from "@/lib/enquiryLink";

const ALL = "All";

export const BlogListClient: React.FC = () => {
  const router = useRouter();
  const { items, ready } = useCollection<BlogPost>("blog");
  const [activeCategory, setActiveCategory] = useState(ALL);

  const published = useMemo(() => items.filter((p) => p.isPublished), [items]);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(published.map((p) => p.category).filter(Boolean)))],
    [published]
  );

  const visible =
    activeCategory === ALL
      ? published
      : published.filter((p) => p.category === activeCategory);

  const postHref = (post: BlogPost) => `/blog/${post.slug || post.id}`;

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={() => router.push(contactEnquiryHref(""))} />

      {/* Page hero */}
      <header className="relative bg-primary pt-32 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />

        <Container className="relative">
          <nav className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Blog</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-tight">
            Travel Stories & <span className="text-gold">Guides</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Field notes, seasonal guides, and honest advice from the designers who
            plan our journeys — everything we learn on the road, shared with you.
          </p>

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="inline-flex max-w-full flex-wrap gap-1 p-1 bg-white/10 backdrop-blur-md rounded-3xl sm:rounded-full border border-white/15 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
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
        </Container>
      </header>

      {/* Posts grid */}
      <main className="flex-1 py-16 sm:py-20 bg-sand-bg/40">
        <Container>
          {ready && visible.length === 0 ? (
            <p className="text-center text-foreground-muted py-16">
              No articles here yet — check back soon for fresh travel stories.
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
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10" />
                      )}
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
      </main>

      <Footer />
    </div>
  );
};

export default BlogListClient;
