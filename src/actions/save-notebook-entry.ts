'use server';

interface NotebookEntryPayload {
  userId: string;
  entryData: Record<string, any>;
}

export async function saveNotebookEntryAction(
  payload: NotebookEntryPayload
): Promise<{ success: boolean; message: string; debugUrl?: string }> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
  if (!base) {
    return { success: false, message: 'NEXT_PUBLIC_API_BASE_URL no configurada.' };
  }

  try {
    const response = await fetch(`${base}/save-notebook-entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || `Error en backend (HTTP ${response.status})`,
        debugUrl: result?.debugUrl,
      };
    }

    return {
      success: result?.success === true,
      message: result?.message || (result?.success ? 'Entrada guardada.' : 'Error del backend.'),
      debugUrl: result?.debugUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.name === 'AbortError' ? 'Tiempo de espera agotado.' : 'Error interno en el guardado.',
    };
  }
}
