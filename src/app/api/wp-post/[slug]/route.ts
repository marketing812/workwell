
import { NextResponse, type NextRequest } from 'next/server';
import { getPostBySlug } from '@/data/resourcesData';

interface WPPostRouteContext {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, context: WPPostRouteContext) {
    const { slug } = context.params;

    try {
        const post = await getPostBySlug(slug);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json(post);
    } catch (error) {
        console.error(`Error fetching post with slug ${slug}:`, error);
        return NextResponse.json({ error: 'Failed to load post data' }, { status: 500 });
    }
}
