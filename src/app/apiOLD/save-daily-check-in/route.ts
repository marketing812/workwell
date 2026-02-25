import { NextResponse } from 'next/server';

// This API route has been deprecated and its logic moved to a server action
// in src/actions/save-daily-check-in.ts to support static exports.
// This file can be safely deleted.

export async function POST(request: Request) {
  return NextResponse.json(
    {
      error: 'This API route is deprecated and no longer functional. Use the saveDailyCheckInAction server action instead.',
    },
    { status: 410 } // 410 Gone
  );
}
