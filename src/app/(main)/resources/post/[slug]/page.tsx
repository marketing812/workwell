import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft } from 'lucide-react';
import { getPostBySlug, getPostsByCategory, getResourceCategories } from '@/data/resourcesData';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const categories = await getResourceCategories();
    const allPosts = await Promise.all(
      categories.map((category) => getPostsByCategory(category.slug))
    );
    const posts = allPosts.flat();
    const dedupedSlugs = [...new Set(posts.map((post) => post.slug))];
    return dedupedSlugs.map((slug) => ({ slug }));
}
interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function normalizeResourceLinkHref(rawHref: string): string {
  const href = String(rawHref || "").trim();
  if (!href) return href;

  const lowerHref = href.toLowerCase();
  if (
    lowerHref.startsWith("#") ||
    lowerHref.startsWith("mailto:") ||
    lowerHref.startsWith("tel:") ||
    lowerHref.startsWith("javascript:")
  ) {
    return href;
  }

  const wpHosts = new Set([
    "workwellfut.com",
    "www.workwellfut.com",
    "workwellfut.hl1450.dinaserver.com",
  ]);

  const toInternalPath = (pathname: string, search = "", hash = ""): string => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return href;

    const categoryIndex = segments.indexOf("category");
    if (categoryIndex >= 0 && segments[categoryIndex + 1]) {
      return `/resources/category/${segments[categoryIndex + 1]}${search}${hash}`;
    }

    const slug = segments[segments.length - 1];
    if (!slug) return href;
    return `/resources/post/${slug}${search}${hash}`;
  };

  if (href.startsWith("/")) {
    if (href.startsWith("/resources/")) return href;
    try {
      const u = new URL(href, "https://workwellfut.com");
      return toInternalPath(u.pathname, u.search, u.hash);
    } catch {
      return href;
    }
  }

  if (/^https?:\/\//i.test(href)) {
    try {
      const u = new URL(href);
      if (wpHosts.has(u.hostname.toLowerCase())) {
        return toInternalPath(u.pathname, u.search, u.hash);
      }
      return href;
    } catch {
      return href;
    }
  }

  // Enlaces relativos (p. ej. "otro-articulo" o "./otro-articulo").
  const cleaned = href.replace(/^\.\//, "").replace(/\/+$/, "");
  if (!cleaned) return href;
  const [pathPart, hashPart = ""] = cleaned.split("#", 2);
  const [slugPart, queryPart = ""] = pathPart.split("?", 2);
  const slug = slugPart.split("/").filter(Boolean).pop();
  if (!slug) return href;
  const query = queryPart ? `?${queryPart}` : "";
  const hash = hashPart ? `#${hashPart}` : "";
  return `/resources/post/${slug}${query}${hash}`;
}

function normalizeResourceContentHtml(html: string): string {
  return String(html || "").replace(
    /<a\b([^>]*?)\bhref=(["'])(.*?)\2([^>]*)>/gi,
    (_full, before, quote, href, after) => {
      const normalizedHref = normalizeResourceLinkHref(href);
      return `<a${before}href=${quote}${normalizedHref}${quote}${after}>`;
    }
  );
}

function normalizeResourceTitleHtml(html: string): string {
  return String(html || "")
    .replace(/&nbsp;|&#160;|\u00A0/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    if (imageUrl) {
        imageUrl = imageUrl.replace('workwellfut.hl1450.dinaserver.com', 'workwellfut.com');
    }

    const normalizedTitleHtml = normalizeResourceTitleHtml(post.title.rendered);

    return (
        <div className="container mx-auto py-8 max-w-4xl">
        <Card className="shadow-xl overflow-hidden">
            <CardHeader className="border-b p-0">
                {imageUrl && (
                    <div className="relative h-64 w-full">
                        <Image 
                            src={imageUrl} 
                            alt={normalizedTitleHtml} 
                            fill 
                            className="object-cover"
                            data-ai-hint="resource article header"
                        />
                    </div>
                )}
                <div className="p-6">
                    <CardTitle
                      className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight whitespace-normal break-normal hyphens-none [overflow-wrap:normal] [word-break:normal] [text-wrap:balance]"
                      dangerouslySetInnerHTML={{ __html: normalizedTitleHtml }}
                    />
                    
                </div>
            </CardHeader>
            <CardContent className="py-6 px-6 md:px-8">
                <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: normalizeResourceContentHtml(post.content.rendered) }} />
            </CardContent>
        </Card>

        <div className="mt-8 text-center">
            <Button variant="outline" asChild>
            <Link href="/resources">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Recursos
            </Link>
            </Button>
        </div>
        </div>
    );
}

