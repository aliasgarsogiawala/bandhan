import type { Metadata } from "next";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { blogPosts } from "@/data/mockData";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug || p.id }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Metadata is resolved from seed content; posts authored later in the CMS
  // live in the browser and fall back to a generic title.
  const post = blogPosts.find((p) => (p.slug || p.id) === slug);
  if (!post) {
    return { title: "Travel Blog | Bandhan Tours" };
  }
  return {
    title: `${post.title} | Bandhan Tours`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
