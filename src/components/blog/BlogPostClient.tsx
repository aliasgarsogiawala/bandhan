"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import PageShell from "@/components/ui/PageShell";
import PageHero from "@/components/ui/PageHero";
import { useCollection } from "@/lib/admin/store";
import type { BlogPost } from "@/lib/admin/types";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { placeholderImage } from "@/lib/placeholderImages";

export const BlogPostClient: React.FC<{ slug: string }> = ({ slug }) => {
  const router = useRouter();
  const { items, ready } = useCollection<BlogPost>("blog");

  const post = useMemo(
    () => items.find((p) => (p.slug || p.id) === slug || p.id === slug),
    [items, slug]
  );

  const related = useMemo(
    () =>
      post
        ? items
            .filter((p) => p.isPublished && p.id !== post.id)
            .filter((p) => p.category === post.category)
            .slice(0, 3)
        : [],
    [items, post]
  );

  const paragraphs = useMemo(
    () => (post?.content || "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
    [post]
  );

  if (ready && (!post || !post.isPublished)) {
    return (
      <PageShell tone="sand" offsetTop mainClassName="flex items-center justify-center pb-20 pt-8" onEnquiryClick={() => router.push(contactEnquiryHref(""))}>
          <div className="text-center">
            <p className="text-5xl mb-4">🧭</p>
            <h1 className="text-2xl font-heading font-bold text-primary">Article not found</h1>
            <p className="mt-2 text-foreground-muted">This story may have been moved or unpublished.</p>
            <Link
              href="/blog"
              className="inline-block mt-6 px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              Back to all articles
            </Link>
          </div>
      </PageShell>
    );
  }

  return (
    <PageShell tone="sand" onEnquiryClick={() => router.push(contactEnquiryHref(""))}>
      <PageHero
        priority
        eyebrow={post?.category}
        title={post?.title ?? "Loading…"}
        image={post?.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200"}
        imageAlt=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]}
      >
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
          {post?.author && <span className="font-semibold text-white">{post.author}</span>}
          {post?.date && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>{post.date}</span>
            </>
          )}
          {post?.readTime && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>{post.readTime}</span>
            </>
          )}
        </div>
      </PageHero>

      <section className="bg-sand-bg/40 py-12 sm:py-16">
        <Container className="max-w-3xl">
          {/* Cover */}
          {post?.coverImage && (
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-soft -mt-24 sm:-mt-28 mb-10 border-4 border-white">
              <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
            </div>
          )}

          {post?.excerpt && (
            <p className="text-lg sm:text-xl text-primary font-heading leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}

          <article className="space-y-5">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-base text-foreground leading-8">
                {para}
              </p>
            ))}
          </article>

          {/* CTA */}
          <div className="mt-12 rounded-3xl bg-primary text-white p-8 text-center">
            <h3 className="text-xl font-heading font-bold">Inspired to travel?</h3>
            <p className="mt-2 text-slate-300 text-sm max-w-md mx-auto">
              Tell us where you dream of going and our designers will craft an itinerary around you.
            </p>
            <Link
              href="/plan-trip"
              className="inline-block mt-5 px-6 py-2.5 rounded-full bg-gold text-primary text-sm font-bold hover:brightness-105 transition-all"
            >
              Plan a Custom Trip
            </Link>
          </div>
        </Container>

        {/* Related posts */}
        {related.length > 0 && (
          <Container className="max-w-5xl mt-16">
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">More like this</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug || p.id}`}
                  className="group bg-white overflow-hidden shadow-soft hover:shadow-lg transition-all border border-slate-100/50"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image src={p.coverImage || placeholderImage(p.id)} alt={p.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-heading font-bold text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-foreground-muted">{p.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        )}
      </section>
    </PageShell>
  );
};

export default BlogPostClient;
