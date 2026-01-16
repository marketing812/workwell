export async function GET() {
    return Response.json({
      ok: true,
      sha: process.env.GITHUB_SHA ?? process.env.COMMIT_SHA ?? null,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      nodeEnv: process.env.NODE_ENV ?? null,
    });
  }
  