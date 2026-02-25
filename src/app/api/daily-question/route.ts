// This API route has been deprecated and its logic moved to a server action
// in src/actions/daily-question.ts to support static exports.
// This file can be safely deleted.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: 'This API route is deprecated and no longer functional.',
    },
    { status: 410 } // 410 Gone
  );
}
