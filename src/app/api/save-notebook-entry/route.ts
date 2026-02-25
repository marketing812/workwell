import { NextResponse } from 'next/server';

// This API route has been deprecated. The logic has been moved to a server action
// in src/actions/save-notebook-entry.ts
export async function POST(request: Request) {
  return NextResponse.json(
    {
      error: 'This API route is deprecated and no longer functional. Use the saveNotebookEntryAction server action instead.',
    },
    { status: 410 } // 410 Gone
  );
}
