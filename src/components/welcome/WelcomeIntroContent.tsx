"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Capacitor } from "@capacitor/core";

interface WelcomeIntroContentProps {
  showContinue?: boolean;
  onContinue?: () => void;
  onScreenChange?: (screen: number) => void;
}

const MOTIVATION_OPTIONS = [
  "Gestionar mejor el estrés.",
  "Comprender mejor mis emociones.",
  "Mejorar mi bienestar.",
  "Desarrollar habilidades personales.",
  "Simplemente sentirme mejor.",
];

export function WelcomeIntroContent({ showContinue = false, onContinue, onScreenChange }: WelcomeIntroContentProps) {
  const router = useRouter();
  const { user } = useUser();
  const [screen, setScreen] = useState(1);
  const [selectedMotivation, setSelectedMotivation] = useState<string | null>(null);
  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    onScreenChange?.(screen);
  }, [onScreenChange, screen]);

  const userName = useMemo(() => {
    const rawName = user?.name?.trim();
    if (!rawName) return "Usuario";
    const firstName = rawName.split(" ")[0]?.trim();
    return firstName || "Usuario";
  }, [user?.name]);

  const goNext = () => setScreen((prev) => Math.min(prev + 1, 6));

  const handleStartEvaluation = () => {
    if (onContinue) {
      onContinue();
      return;
    }
    router.push("/assessment/guided");
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 text-center">
      {screen === 1 && (
        <>
          <div className="relative mx-auto mb-2 flex w-full max-w-4xl flex-col items-center gap-5 px-6 py-4">
            <div className="relative h-[310px] w-full max-w-5xl">
              <Image
                src="/welcome-bienvenida-v2.jpg"
                alt="Ilustracion de bienvenida de EMOTIVA"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="relative space-y-4">
              <h2 className="text-4xl font-bold tracking-tight md:text-6xl">¡Hola, {userName}!</h2>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-foreground/85 md:text-2xl">
                Bienvenido o bienvenida a EMOTIVA. Este es un espacio para ayudarte a comprender cómo funciona tu
                mente, cómo gestionas tus emociones y qué recursos tienes para afrontar las dificultades del día a día.
              </p>
            </div>
          </div>
          <div className="pt-2">
            <Button size="lg" className="min-w-56 px-8 py-7 text-lg md:text-xl" onClick={goNext}>
              Quiero empezar
            </Button>
          </div>
        </>
      )}

      {screen === 2 && (
        <div className="flex flex-col gap-6 md:gap-8">
          {isNativeApp ? (
            <div className="order-1 relative left-1/2 w-screen -translate-x-1/2 border-y bg-muted/30 p-6 text-center md:left-auto md:w-full md-translate-x-0 md:rounded-xl md:border md:px-6 md:py-8">
              <p className="text-base leading-relaxed md:text-lg">
                En iPhone el reproductor integrado de YouTube puede fallar dentro de la app. Puedes ver este vídeo de
                bienvenida directamente en YouTube.
              </p>
              <div className="pt-4">
                <Button asChild size="lg">
                  <a
                    href="https://www.youtube.com/watch?v=riFTSyQWv84"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver vídeo en YouTube
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="order-1 relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-black md:left-auto md:w-full md:translate-x-0 md:rounded-xl">
              <div className="relative -mt-2 h-[68vh] min-h-[460px] w-full md:mt-0 md:h-auto md:min-h-0 md:pb-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/riFTSyQWv84"
                  title="Video de bienvenida"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="order-2 space-y-4 px-4 md:px-0">
            <h2 className="text-3xl font-bold md:text-4xl">¿Qué es EMOTIVA?</h2>
            <p className="text-lg leading-relaxed text-black md:text-xl">
              EMOTIVA es una plataforma creada por profesionales de la psicología para ayudarte a comprender tu
              funcionamiento emocional y desarrollar habilidades útiles para tu vida diaria.
              <br />
              <br />A través de una breve evaluación inicial crearemos tu mapa emocional personal, a partir del cual te
              recomendaremos contenidos y ejercicios adaptados a tus necesidades.
            </p>
          </div>

          <div className="order-3 px-4 pt-2 md:px-0">
            <Button size="lg" onClick={goNext}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {screen === 3 && (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 md:gap-8 md:px-0">
          <div className="relative h-[240px] w-full max-w-4xl">
            <Image
              src="/welcome-bienvenida-v2.jpg"
              alt="Ilustracion de bienvenida de EMOTIVA"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">¿Qué obtendrás con EMOTIVA?</h2>
          <ul className="mx-auto max-w-2xl list-disc space-y-1 pl-6 text-left text-lg leading-relaxed text-black md:text-xl">
            <li>Perfil emocional personalizado.</li>
            <li>Rutas adaptadas a ti.</li>
            <li>Herramientas prácticas.</li>
            <li>Seguimiento de tu progreso.</li>
          </ul>
          <p className="text-lg leading-relaxed text-black md:text-xl">
            Cada persona es diferente.
            <br />
            Por eso EMOTIVA adapta el contenido a tu perfil.
          </p>
          <div className="pt-2">
            <Button size="lg" onClick={goNext}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {screen === 4 && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6 px-4 md:gap-8 md:px-0">
          <h2 className="text-3xl font-bold md:text-4xl">Antes de empezar, una pregunta:</h2>
          <p className="text-lg leading-relaxed text-black md:text-xl">
            Ahora mismo, ¿en qué te gustaría trabajar en ti?
          </p>
          <div className="grid gap-3 text-left">
            {MOTIVATION_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedMotivation(option)}
                className={`rounded-lg border px-4 py-3 text-base md:text-lg transition-colors ${
                  selectedMotivation === option
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="pt-2">
            <Button size="lg" onClick={goNext}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {screen === 5 && (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 md:gap-8 md:px-0">
          <div className="relative h-[240px] w-full max-w-4xl">
            <Image
              src="/welcome-bienvenida-v2.jpg"
              alt="Ilustracion de bienvenida de EMOTIVA"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">Antes de empezar</h2>
          <p className="max-w-3xl text-center text-base leading-relaxed text-black md:text-lg">
            Vamos a hacer una breve evaluación para entender mejor cómo te sientes y cómo afrontas tu día a día.
            <br />
            <br />
            No hay respuestas correctas o incorrectas. Responde según cómo te sientes y actúas habitualmente.
            <br />
            <br />
            Este cuestionario no es solo una evaluación. Es un momento contigo. Una invitación a mirar hacia dentro
            con honestidad, curiosidad y sin juicio.
          </p>

          <div className="max-w-3xl text-left">
            <ul className="list-disc space-y-1 pl-6 text-base text-black md:text-lg">
              <li>Duración: 5-7 minutos.</li>
              <li>Escala tipo Likert (1-5).</li>
              <li>Resultados: perfil emocional interpretado + recomendaciones personalizadas.</li>
            </ul>
          </div>

          <div className="pt-2">
            <Button size="lg" onClick={goNext}>
              Saber más
            </Button>
          </div>
        </div>
      )}

      {screen === 6 && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6 px-4 md:gap-8 md:px-0">
          <h2 className="text-3xl font-bold md:text-4xl">Importante</h2>
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-black md:text-lg">
            Esta evaluación no es un diagnóstico formal ni sustituye un proceso terapéutico clínico.
            <br />
            Tus respuestas son confidenciales.
            <br />
            La información se utiliza únicamente para generar tu perfil emocional y ofrecerte recomendaciones
            personalizadas. Los datos se analizan de forma agregada y anónima.
          </p>

          <div className="mx-auto max-w-3xl text-left text-black">
            <p className="mb-2 text-base font-semibold md:text-lg">En unos segundos recibirás:</p>
            <ul className="list-disc space-y-1 pl-6 text-base md:text-lg">
              <li>Tu perfil emocional.</li>
              <li>Tus fortalezas psicológicas.</li>
              <li>Las áreas que puedes mejorar.</li>
              <li>Tus primeras rutas recomendadas.</li>
            </ul>
          </div>

          <div className="pt-2">
            <Button size="lg" onClick={handleStartEvaluation}>
              Empezar evaluación
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
