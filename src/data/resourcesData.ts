export type ResourcePost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  categories: number[];
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
    "wp:term"?: { id: number; name: string; slug: string }[][];
  };
};

export type ResourceCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

export async function getResourceCategories(): Promise<ResourceCategory[]> {
  const base = getApiBase();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/resources`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
      return [];
    }
    const categories: ResourceCategory[] = await res.json();
    return categories.filter((cat) => cat.slug !== "sin-categoria" && cat.count > 0);
  } catch (error) {
    console.error("Error in getResourceCategories:", error);
    return [];
  }
}

export async function getResources(): Promise<ResourcePost[]> {
  return [];
}

export async function getPostsByCategory(categorySlug: string): Promise<ResourcePost[]> {
  const base = getApiBase();
  if (!base || !categorySlug) return [];

  try {
    const res = await fetch(`${base}/resources/category/${encodeURIComponent(categorySlug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const payload = await res.json();
    return Array.isArray(payload?.posts) ? (payload.posts as ResourcePost[]) : [];
  } catch (error) {
    console.error(`Error in getPostsByCategory for slug ${categorySlug}:`, error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<ResourcePost | null> {
  const base = getApiBase();
  if (!base || !slug) return null;

  try {
    const res = await fetch(`${base}/resources/post/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`Failed to fetch post by slug ${slug}: ${res.status} ${res.statusText}`);
      return null;
    }
    const post: ResourcePost | null = await res.json();
    return post ?? null;
  } catch (error) {
    console.error(`Error in getPostBySlug for slug ${slug}:`, error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<ResourceCategory | null> {
  try {
    const categories = await getResourceCategories();
    return categories.find((cat) => cat.slug === slug) || null;
  } catch (error) {
    console.error(`Error in getCategoryBySlug for slug ${slug}:`, error);
    return null;
  }
}
