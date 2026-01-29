import { retrieveDocsContext } from "@/ai/rag/retrieve";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "desregulación emocional";
  const { context, chunks } = await retrieveDocsContext(q);

  return Response.json({
    ok: true,
    q,
    chunks: chunks.length,
    ctxLen: context.length ?? 0,
    preview: (context ?? "").slice(0, 500),
  });
}
