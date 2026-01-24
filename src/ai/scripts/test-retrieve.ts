import { retrieveDocsContext } from "../rag/retrieve";

async function main() {
  const q = "¿Qué es la terapia cognitiva según Beck?";
  const { context, chunks } = await retrieveDocsContext(q, { k: 4 });

  console.log("CHUNKS:", chunks.length);
  console.log("----- CONTEXT -----");
  console.log(context.slice(0, 1500));
  console.log("\nOK ✅");
}

main().catch((e) => {
  console.error("\nERROR ❌");
  console.error(e?.message ?? e);
  process.exit(1);
});
