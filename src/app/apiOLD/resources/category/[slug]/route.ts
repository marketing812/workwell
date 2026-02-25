import { NextResponse } from 'next/server';

// This API route is deprecated.
// Data fetching has been moved directly into Server Components to support static site generation.
// This file can be safely deleted.

export async function GET(request: Request) {
  return NextResponse.json(
    {
      error: 'This API route is deprecated and no longer functional.',
    },
    { status: 410 } // 410 Gone
  );
}
