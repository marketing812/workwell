
// This route is no longer needed as the logic is handled by [slug]/route.ts
// It can be safely deleted.
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ error: 'This route is deprecated. Use /api/resources/post/[slug]' }, { status: 404 });
}
