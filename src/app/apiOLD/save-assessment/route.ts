// This API route has been deprecated and its logic moved to a server action
// in src/actions/client-assessment.ts to support static exports.
// This file can be safely deleted.

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    {
      error: 'This API route is deprecated. Use the saveAssessment server action instead.',
    },
    { status: 410 } // 410 Gone
  );
}
