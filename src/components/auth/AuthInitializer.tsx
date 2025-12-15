"use client";

import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

// Este componente está obsoleto y será eliminado.
// La lógica se ha movido a UserContext.tsx para una mayor robustez.

export default function AuthInitializer() {
  const { user, loading } = useUser();

  useEffect(() => {
    // La lógica de inicialización ahora vive en UserProvider
  }, [user, loading]);

  return null; // Este componente ya no renderiza nada.
}
