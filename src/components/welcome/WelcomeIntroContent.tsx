"use client";

import { Button } from "@/components/ui/button";
import { EXTERNAL_SERVICES_BASE_URL } from "@/lib/constants";

interface WelcomeIntroContentProps {
  showContinue?: boolean;
  onContinue?: () => void;
}

export function WelcomeIntroContent({ showContinue = false, onContinue }: WelcomeIntroContentProps) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Bienvenida</h2>
      <p className="text-lg md:text-xl leading-relaxed">Bienvenido a EMOTIVA</p>

      <div className="w-full">
        <audio controls controlsList="nodownload" className="w-full">
          <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/introduccionunica.mp3`} type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>

      <div className="w-full rounded-xl overflow-hidden bg-black/10">
        <div className="relative w-full pb-[177.78%] sm:pb-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/riFTSyQWv84"
            title="Video de bienvenida"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      {showContinue ? (
        <div className="pt-2">
          <Button size="lg" onClick={onContinue}>
            Continuar
          </Button>
        </div>
      ) : null}
    </div>
  );
}
