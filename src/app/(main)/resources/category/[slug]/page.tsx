import { CategoryPageClient } from '@/components/resources/CategoryPageClient';
import { getResourceCategories } from '@/data/resourcesData';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getResourceCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
