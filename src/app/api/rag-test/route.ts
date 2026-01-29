/*import { retrieveDocsContext } from "@/ai/rag/retrieve"; // ajusta si tu path es distinto
export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "desregulación emocional";
  const ctx = await retrieveDocsContext(q);

  return Response.json({
    ok: true,
    q,
    ctxLen: ctx?.length ?? 0,
    preview: (ctx ?? "").slice(0, 500),
  });
}
*/