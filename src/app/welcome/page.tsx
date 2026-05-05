"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { WelcomeIntroContent } from "@/components/welcome/WelcomeIntroContent";

const WELCOME_SEEN_KEY = "workwell-welcome-seen";

type WelcomeStep = "hola" | "pregunta" | "introduccion" | "opciones";

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState<WelcomeStep>("hola");
  const [visible, setVisible] = useState(false);
  const [introScreen, setIntroScreen] = useState(1);

  useEffect(() => {
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousHtmlBackground = document.documentElement.style.backgroundColor;

    document.body.style.backgroundColor = "#ffffff";
    document.documentElement.style.backgroundColor = "#ffffff";

    return () => {
      document.body.style.backgroundColor = previousBodyBackground;
      document.documentElement.style.backgroundColor = previousHtmlBackground;
    };
  }, []);

  useEffect(() => {
    const hasSeenWelcome = typeof window !== "undefined" && localStorage.getItem(WELCOME_SEEN_KEY) === "true";

    if (hasSeenWelcome) {
      setStep("opciones");
      setVisible(true);
      return;
    }

    const fadeInTimer = setTimeout(() => setVisible(true), 100);
    const transitionTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setStep("pregunta"), 500);
    }, 4100);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  useEffect(() => {
    if (step === "pregunta" || step === "introduccion" || step === "opciones") {
      const fadeInTimer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(fadeInTimer);
    }
  }, [step]);

  const handleShowIntro = () => {
    setVisible(false);
    setTimeout(() => setStep("introduccion"), 500);
  };

  const handleStartAssessment = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WELCOME_SEEN_KEY, "true");
    }
    router.push("/assessment/guided");
  };

  const isImmersiveIntro = step === "introduccion" && introScreen === 2;

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center w-full min-h-screen transition-colors duration-500 ease-in-out",
        isImmersiveIntro ? "justify-start p-0" : "justify-center p-4",
        step === "pregunta" || step === "opciones"
          ? "bg-primary text-primary-foreground"
          : "bg-white text-primary"
      )}
      style={step === "pregunta" || step === "opciones" ? undefined : { backgroundColor: "#ffffff" }}
    >
      <div
        className={cn(
          "relative flex-grow flex flex-col items-center w-full",
          isImmersiveIntro ? "justify-start" : "justify-center"
        )}
      >
        {step === "hola" && (
          <h1
            className={cn(
              "text-8xl md:text-9xl font-bold transition-opacity duration-500 ease-in-out",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            ¡Hola!
          </h1>
        )}

        {step === "pregunta" && (
          <div
            className={cn(
              "flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            <Logo className="mb-12 text-primary-foreground" white />
            <h1 className="text-6xl md:text-8xl font-bold mb-12">¿Cómo estás hoy?</h1>
            <button
              onClick={handleShowIntro}
              className="mt-8 transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-foreground/50 rounded-full"
              aria-label="Continuar"
            >
              <ArrowRight className="h-24 w-24 text-primary-foreground" />
            </button>
          </div>
        )}

        {step === "introduccion" && (
          <div
            className={cn(
              "w-full max-w-4xl transition-opacity duration-500 ease-in-out",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            <WelcomeIntroContent
              showContinue
              onContinue={handleStartAssessment}
              onScreenChange={setIntroScreen}
            />
          </div>
        )}

        {step === "opciones" && (
          <div
            className={cn(
              "flex flex-col items-center justify-center space-y-8 transition-opacity duration-500 ease-in-out",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
             <Link href="/dashboard" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Mi Panel
                </Link>
                   <Link href="/paths" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Rutas
                </Link>
             <Link href="/emotional-log" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Mis autorregistros
                </Link>
             <Link href="/chatbot" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Mentor IA
                </Link>
             <Link href="/resources" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Aprende
                </Link>
          </div>
        )}
      </div>
    </div>
  );
}
