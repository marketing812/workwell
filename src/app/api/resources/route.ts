
import { NextResponse } from 'next/server';
import { getResourceCategories } from '@/data/resourcesData';

export async function GET(request: Request) {
  try {
    const categories = await getResourceCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching resource categories:", error);
    return NextResponse.json({ error: 'Failed to load resource categories' }, { status: 500 });
  }
}
