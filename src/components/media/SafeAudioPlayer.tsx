"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SafeAudioPlayerProps {
  src: string;
  className?: string;
  compact?: boolean;
}

export function SafeAudioPlayer({ src, className, compact = false }: SafeAudioPlayerProps) {
  const [hasError, setHasError] = useState(false);

  const sanitizedSrc = useMemo(() => String(src || "").trim(), [src]);

  if (!sanitizedSrc) {
    return null;
  }

  return (
    <div className={className}>
      <audio
        key={sanitizedSrc}
        src={sanitizedSrc}
        controls
        controlsList="nodownload"
        preload="metadata"
        className={compact ? "block h-10 w-full max-w-full" : "w-full"}
        onError={() => setHasError(true)}
        onLoadedData={() => setHasError(false)}
      />
      {hasError && (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          <p>
            Este audio no se ha podido reproducir dentro de la app. Puedes abrirlo directamente para escucharlo.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link href={sanitizedSrc} target="_blank" rel="noopener noreferrer">
              Abrir audio
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
