
import { NextResponse, type NextRequest } from 'next/server';
import { getPostsByCategory, getCategoryBySlug } from '@/data/resourcesData';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { slug } = params;

  try {
    const category = await getCategoryBySlug(slug);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    const posts = await getPostsByCategory(slug);
    return NextResponse.json({ category, posts });
  } catch (error) {
    console.error(`Error fetching data for category ${slug}:`, error);
    return NextResponse.json({ error: 'Failed to load category data' }, { status: 500 });
  }
}
