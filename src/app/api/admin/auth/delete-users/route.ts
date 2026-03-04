import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin, getDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_USERS_PER_REQUEST = 1000;

type DeleteUsersBody = {
  uids?: unknown;
  deleteFirestoreUsers?: unknown;
};

function getApiKeyFromRequest(request: NextRequest): string {
  const headerKey = request.headers.get("x-admin-api-key");
  if (headerKey) return headerKey;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return "";
}

function validateUids(value: unknown): { ok: true; uids: string[] } | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return { ok: false, error: "El campo 'uids' debe ser un array de strings." };
  }

  if (value.length === 0) {
    return { ok: false, error: "El array 'uids' no puede estar vacio." };
  }

  if (value.length > MAX_USERS_PER_REQUEST) {
    return {
      ok: false,
      error: `Solo se permiten hasta ${MAX_USERS_PER_REQUEST} usuarios por peticion.`,
    };
  }

  const invalid = value.find((uid) => typeof uid !== "string" || uid.trim().length === 0);
  if (invalid !== undefined) {
    return { ok: false, error: "Todos los elementos de 'uids' deben ser strings no vacios." };
  }

  const cleaned = value.map((uid) => String(uid).trim());
  const deduped = [...new Set(cleaned)];

  return { ok: true, uids: deduped };
}

export async function POST(request: NextRequest) {
  const expectedApiKey = process.env.ADMIN_DELETE_USERS_API_KEY;
  if (!expectedApiKey) {
    return NextResponse.json(
      { ok: false, error: "Falta configurar ADMIN_DELETE_USERS_API_KEY en el servidor." },
      { status: 500 }
    );
  }

  const requestApiKey = getApiKeyFromRequest(request);
  if (!requestApiKey || requestApiKey !== expectedApiKey) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  let body: DeleteUsersBody;
  try {
    body = (await request.json()) as DeleteUsersBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Body JSON invalido." }, { status: 400 });
  }

  const validation = validateUids(body.uids);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }
  const deleteFirestoreUsers = body.deleteFirestoreUsers === true;

  try {
    const result = await getAuthAdmin().deleteUsers(validation.uids);

    let firestoreUsersDeleted = 0;
    let firestoreErrors: Array<{ uid: string; message: string }> = [];

    if (deleteFirestoreUsers) {
      const db = getDb();
      for (const uid of validation.uids) {
        try {
          // 1) Remove users/{uid} when uid is the document id.
          await db.collection("users").doc(uid).delete();
          firestoreUsersDeleted += 1;

          // 2) Remove any additional docs where field "id" matches the uid.
          const qs = await db.collection("users").where("id", "==", uid).get();
          if (!qs.empty) {
            const batch = db.batch();
            qs.docs.forEach((docSnap) => {
              // Avoid double-delete when doc id is uid and already deleted above.
              if (docSnap.id !== uid) {
                batch.delete(docSnap.ref);
                firestoreUsersDeleted += 1;
              }
            });
            await batch.commit();
          }
        } catch (error: any) {
          firestoreErrors.push({ uid, message: error?.message ?? "Unknown error" });
        }
      }
    }

    return NextResponse.json(
      {
        ok: true,
        requestedCount: validation.uids.length,
        successCount: result.successCount,
        failureCount: result.failureCount,
        firestore: {
          attempted: deleteFirestoreUsers,
          deletedCount: firestoreUsersDeleted,
          failureCount: firestoreErrors.length,
          errors: firestoreErrors,
        },
        errors: result.errors.map((err) => ({
          index: err.index,
          uid: validation.uids[err.index] ?? null,
          code: err.error.code,
          message: err.error.message,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Error interno al borrar usuarios.",
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
