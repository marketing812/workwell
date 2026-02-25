import { NextResponse } from 'next/server';

// This API route has been deprecated. The logic has been moved to a server action
// in src/actions/trigger-reminder.ts
export async function GET() {
  return NextResponse.json(
    {
      error: 'This API route is deprecated and no longer functional.',
    },
    { status: 410 } // 410 Gone
  );
}
