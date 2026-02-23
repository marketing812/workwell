
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import type { DailyQuestion, DailyQuestionApiResponse } from '@/types/daily-question';
import { useUser } from '@/contexts/UserContext';
import { getDailyQuestion } from '@/data/dailyQuestion';
import { useToast } from '@/hooks/use-toast';

const CHECK_INTERVAL_MS = 1000 * 60 * 30; // Check every 30 minutes

interface DailyCheckInData extends Array<string> {}

interface DailyCheckInContextType {
  unansweredQuestions: DailyQuestion[];
  forceOpen: () => void;
  closePopup: (questionId: string) => void;
  showPopup: boolean;
  dismissPopup: () => void;
}

const DailyCheckInContext = createContext<DailyCheckInContextType | undefined>(undefined);

export const DailyCheckInProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [unansweredQuestions, setUnansweredQuestions] = useState<DailyQuestion[]>([]);
  const [isForcedOpen, setIsForcedOpen] = useState(false);
  const [wasDismissedThisSession, setWasDismissedThisSession] = useState(false);
  

  const loadAndFilterQuestions = useCallback(async (): Promise<DailyQuestion[]> => {
    if (!user?.id) {
      setUnansweredQuestions([]);
      return [];
    }

    const apiResponse: DailyQuestionApiResponse | null = await getDailyQuestion(user.id);
    
    // La API ahora devuelve la siguiente pregunta, o una vacía si se ha completado o hay un error.
    if (apiResponse && apiResponse.questions && apiResponse.questions.length > 0) {
        const nextQuestion = apiResponse.questions[0];
        // El backend devuelve '00000' cuando el ciclo se completa.
        if (nextQuestion.id === "00000") {
            setUnansweredQuestions([]);
            return [];
        }
        setUnansweredQuestions([nextQuestion]);
        return [nextQuestion];
    } else {
        setUnansweredQuestions([]);
        return [];
    }
  }, [user?.id]);
  
  useEffect(() => {
    const initialTimer = setTimeout(() => {
        loadAndFilterQuestions();
    }, 5000);

    const intervalId = setInterval(() => {
        setWasDismissedThisSession(false); // Reinicia periódicamente el descarte
        loadAndFilterQuestions();
    }, CHECK_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [loadAndFilterQuestions]);
  

  const forceOpen = useCallback(async () => {
    if (!user?.id) {
        toast({
            title: "Usuario no identificado",
            description: "Es necesario iniciar sesión para ver la pregunta del día.",
            variant: "destructive"
        });
        return;
    }

    const apiResponse = await getDailyQuestion(user.id);
    
    if (!apiResponse) {
      toast({
        title: "Error de Conexión",
        description: "No se pudo comunicar con el servidor para obtener las preguntas.",
        variant: "destructive",
        duration: 9000,
      });
      return;
    }

    if (apiResponse.error) {
       toast({
        title: "Error del Servidor",
        description: `El servidor respondió con un error: ${apiResponse.error}. Revisa la consola para más detalles.`,
        variant: "destructive",
        duration: 9000,
      });
      console.error("Server Error Details:", apiResponse.details);
      return;
    }

    if (!apiResponse.questions || apiResponse.questions.length === 0) {
      let description: React.ReactNode = "No se recibieron preguntas del servidor.";
      if (apiResponse.debugUrl) {
        description = (
          <div>
            <p>No se encontraron preguntas en la respuesta del servidor.</p>
            <p className="mt-2 text-xs">
              Puedes{" "}
              <a href={apiResponse.debugUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">
                abrir la URL de la API
              </a>{" "}
              para comprobar la respuesta.
            </p>
          </div>
        );
      }
      toast({
        title: "No hay preguntas diarias",
        description: description,
        duration: 9000,
      });
      return;
    }

    const questionToShow = apiResponse.questions[0];

    // El backend devuelve este código cuando se completa el ciclo.
    if (questionToShow.id === "00000") {
        toast({
            title: "¡Ciclo completado!",
            description: "¡Enhorabuena! Has respondido todas las preguntas. La próxima vez que uses esta función, el ciclo comenzará de nuevo.",
        });
        return;
    }

    if (questionToShow) {
      setUnansweredQuestions([questionToShow]);
      setWasDismissedThisSession(false); 
      setIsForcedOpen(true);
    } else {
         toast({
            title: "¡Todo listo por hoy!",
            description: "No hay más preguntas disponibles en este momento.",
        });
    }
  }, [user?.id, toast]);
  
  const dismissPopup = useCallback(() => {
    setIsForcedOpen(false);
    setWasDismissedThisSession(true);
  }, []);

  const closePopup = useCallback((questionId: string) => {
    // Esta función ahora solo gestiona la UI. El guardado se hace en el pop-up.
    setIsForcedOpen(false);
    setWasDismissedThisSession(true); 
    setUnansweredQuestions([]); // Limpia la pregunta para que no vuelva a aparecer hasta la próxima comprobación
  }, []);

  const showPopup = isForcedOpen || (unansweredQuestions.length > 0 && !wasDismissedThisSession);

  const contextValue = { 
    unansweredQuestions, 
    forceOpen, 
    closePopup,
    showPopup,
    dismissPopup
  };

  return (
    <DailyCheckInContext.Provider value={contextValue}>
      {children}
    </DailyCheckInContext.Provider>
  );
};

export function useDailyCheckIn(): DailyCheckInContextType {
  const context = useContext(DailyCheckInContext);
  if (context === undefined) {
    throw new Error('useDailyCheckIn must be used within a DailyCheckInProvider');
  }
  return context;
}
