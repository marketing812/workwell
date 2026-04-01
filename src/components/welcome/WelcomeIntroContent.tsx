"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

interface WelcomeIntroContentProps {
  showContinue?: boolean;
  onContinue?: () => void;
}

const MOTIVATION_OPTIONS = [
  "Gestionar mejor el estrés.",
  "Comprender mejor mis emociones.",
  "Mejorar mi bienestar.",
  "Desarrollar habilidades personales.",
  "Simplemente sentirme mejor.",
];

export function WelcomeIntroContent({ showContinue = false, onContinue }: WelcomeIntroContentProps) {
  const router = useRouter();
  const { user } = useUser();
  const [screen, setScreen] = useState(1);
  const [selectedMotivation, setSelectedMotivation] = useState<string | null>(null);

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
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 text-center">
      {screen === 1 && (
        <>
          <h2 className="text-3xl md:text-4xl font-bold">¡Hola, {userName}!</h2>
          <p className="text-lg md:text-xl leading-relaxed">
            Bienvenido o bienvenida a EMOTIVA.
            <br />
            Este es un espacio para ayudarte a comprender cómo funciona tu mente, cómo gestionas tus emociones y qué
            recursos tienes para afrontar las dificultades del día a día.
          </p>
          <div className="pt-2">
            <Button size="lg" onClick={goNext}>
              Quiero empezar
            </Button>
          </div>
        </>
      )}

      {screen === 2 && (
        <>
          <h2 className="text-3xl md:text-4xl font-bold">¿Qué es EMOTIVA?</h2>
          <p className="text-lg md:text-xl leading-relaxed">
            EMOTIVA es una plataforma creada por profesionales de la psicología para ayudarte a comprender tu
            funcionamiento emocional y desarrollar habilidades útiles para tu vida diaria.
            <br />
            <br />A través de una breve evaluación inicial crearemos tu mapa emocional personal, a partir del cual te
            recomendaremos contenidos y ejercicios adaptados a tus necesidades.
          </p>

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

          <div className="pt-2">
            <Button size="lg" onClick={goNext}>
              Continuar
            </Button>
          </div>
        </>
      )}

      {screen === 3 && (
        <>
          <h2 className="text-3xl md:text-4xl font-bold">¿Qué obtendrás con EMOTIVA?</h2>
          <ul className="text-left text-lg md:text-xl leading-relaxed mx-auto list-disc pl-6 space-y-1">
            <li>Perfil emocional personalizado.</li>
            <li>Rutas adaptadas a ti.</li>
            <li>Herramientas prácticas.</li>
            <li>Seguimiento de tu progreso.</li>
          </ul>
          <p className="text-lg md:text-xl leading-relaxed">
            Cada persona es diferente.
            <br />
            Por eso EMOTIVA adapta el contenido a tu perfil.
          </p>
          <div className="pt-2">
            <Button size="lg" onClick={goNext}>
              Continuar
            </Button>
          </div>
        </>
      )}

      {screen === 4 && (
        <>
          <h2 className="text-3xl md:text-4xl font-bold">Antes de empezar, una pregunta:</h2>
          <p className="text-lg md:text-xl leading-relaxed">Ahora mismo, ¿en qué te gustaría trabajar en ti?</p>
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
        </>
      )}

      {screen === 5 && (
        <>
          <h2 className="text-3xl md:text-4xl font-bold">Antes de empezar</h2>
          <p className="text-left text-base md:text-lg leading-relaxed">
            Vamos a hacer una breve evaluación para entender mejor cómo te sientes y cómo afrontas tu día a día.
            <br />
            <br />
            No hay respuestas correctas o incorrectas. Responde según cómo te sientes y actúas habitualmente.
            <br />
            <br />
            Este cuestionario no es solo una evaluación. Es un momento contigo. Una invitación a mirar hacia dentro
            con honestidad, curiosidad y sin juicio.
          </p>

          <div className="text-left">
            <ul className="list-disc pl-6 space-y-1 text-base md:text-lg">
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
        </>
      )}

      {screen === 6 && (
        <>
          <h2 className="text-3xl md:text-4xl font-bold">Importante</h2>
          <p className="text-left text-base md:text-lg leading-relaxed">
            Esta evaluación no es un diagnóstico formal ni sustituye un proceso terapéutico clínico.
            <br />
            Tus respuestas son confidenciales.
            <br />
            La información se utiliza únicamente para generar tu perfil emocional y ofrecerte recomendaciones
            personalizadas. Los datos se analizan de forma agregada y anónima.
          </p>

          <div className="text-left">
            <p className="text-base md:text-lg font-semibold mb-2">En unos segundos recibirás:</p>
            <ul className="list-disc pl-6 space-y-1 text-base md:text-lg">
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
        </>
      )}
    </div>
  );
}