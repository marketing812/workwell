function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

export async function sendLegacyData(
  data: Record<string, any>,
  type: 'usuario' | 'guardaranimo' | 'guardarlogin' | 'otro_tipo'
): Promise<{ success: boolean; debugUrl: string }> {
  const base = getApiBase();
  if (!base) {
    return { success: false, debugUrl: 'API base no configurada' };
  }

  try {
    const response = await fetch(`${base}/legacy/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({}));
    return {
      success: response.ok && payload?.success === true,
      debugUrl: payload?.debugUrl || '',
    };
  } catch {
    return { success: false, debugUrl: 'Error calling /legacy/sync' };
  }
}

export async function deleteLegacyData(
  userId: string,
  type: 'borrarusuario'
): Promise<{ success: boolean; debugUrl: string }> {
  const base = getApiBase();
  if (!base || !userId || type !== 'borrarusuario') {
    return { success: false, debugUrl: 'Invalid params or API base' };
  }

  try {
    const response = await fetch(`${base}/legacy/delete-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({}));
    return {
      success: response.ok && payload?.success === true,
      debugUrl: payload?.debugUrl || '',
    };
  } catch {
    return { success: false, debugUrl: 'Error calling /legacy/delete-user' };
  }
}

export async function sendLegacyNotebookEntry(
  userId: string,
  entryData: Record<string, any>
): Promise<{ success: boolean; debugUrl: string }> {
  console.warn('DEPRECATED: sendLegacyNotebookEntry is no longer in use.');
  if (!userId || !entryData) return { success: false, debugUrl: 'Invalid payload' };
  return { success: true, debugUrl: '' };
}
