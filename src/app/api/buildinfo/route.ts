export async function GET() {
    return Response.json({
      ok: true,
      marker: "FROM-OUTSIDE-WORKSPACE",
    });
  }
  