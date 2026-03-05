import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ValidateDepartmentBody = {
  departmentId?: unknown;
};

const DEFAULT_EXTERNAL_BASE = "https://workwellfut.com";
const DEFAULT_API_KEY = "4463";

function isDepartmentValidResponse(raw: string): boolean {
  const text = raw.trim();
  if (!text) return false;

  const normalized = text.toLowerCase();
  if (normalized === "ok") return true;

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      const status = String((parsed as { status?: unknown }).status ?? "").toLowerCase();
      const result = String((parsed as { result?: unknown }).result ?? "").toLowerCase();
      const ok = (parsed as { ok?: unknown }).ok;
      return status === "ok" || result === "ok" || ok === true;
    }
  } catch {
    // Non-JSON response is handled by raw text checks.
  }

  return false;
}

export async function POST(request: NextRequest) {
  let body: ValidateDepartmentBody;
  try {
    body = (await request.json()) as ValidateDepartmentBody;
  } catch {
    return NextResponse.json(
      { ok: false, valid: false, error: "Body JSON invalido." },
      { status: 400 }
    );
  }

  const departmentId = String(body.departmentId ?? "").trim();
  if (!departmentId) {
    return NextResponse.json(
      { ok: false, valid: false, error: "El codigo de departamento es obligatorio." },
      { status: 400 }
    );
  }

  const externalBase = process.env.EXTERNAL_SERVICES_BASE_URL || DEFAULT_EXTERNAL_BASE;
  const apiKey = process.env.NOTEBOOK_API_KEY || DEFAULT_API_KEY;

  // Keep legacy-compatible params (token) and also send explicit department fields.
  const url =
    `${externalBase}/wp-content/programacion/wscontenido.php` +
    `?apikey=${encodeURIComponent(apiKey)}` +
    `&tipo=getdepartamento` +
    `&token=${encodeURIComponent(departmentId)}` +
    `&departamento=${encodeURIComponent(departmentId)}` +
    `&iddepartamento=${encodeURIComponent(departmentId)}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          valid: false,
          error: `Error del servicio externo (HTTP ${response.status}).`,
        },
        { status: 502 }
      );
    }

    const valid = isDepartmentValidResponse(responseText);
    return NextResponse.json(
      {
        ok: true,
        valid,
        message: valid
          ? "Departamento validado correctamente."
          : "Codigo de departamento no valido.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        valid: false,
        error: error?.message || "No se pudo validar el departamento.",
      },
      { status: 500 }
    );
  }
}

