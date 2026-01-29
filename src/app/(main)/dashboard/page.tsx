
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { DashboardSummaryCard } from "@/components/dashboard/DashboardSummaryCard";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { MoodEvolutionChart } from "@/components/dashboard/MoodEvolutionChart";
import { useToast } from "@/hooks/use-toast";
import { Smile, TrendingUp, Target, Edit, NotebookPen, CheckCircle, Activity, RefreshCw, Loader2, ArrowRight, ClipboardList, Lightbulb } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useActivePath } from "@/contexts/ActivePathContext";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { getAssessmentHistory, type AssessmentRecord } from "@/data/assessmentHistoryStore";
import { EmotionalProfileChart } from "@/components/dashboard/EmotionalProfileChart";
import { assessmentDimensions as assessmentDimensionsData } from "@/data/assessmentDimensions";
import type { MoodCheckIn } from "@/types/mood-check-in";
import { moodCheckInOptions } from "@/data/moodCheckInOptions";
import { pathsData } from "@/data/pathsData";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { z } from "zod";
import { decryptDataAES } from "@/lib/encryption";

const MoodCheckInFromApiSchema = z.object({
    id: z.string().optional(),
    mood: z.string(),
    score: z.coerce.number(),
    timestamp: z.string(),
});
const MoodCheckInsApiResponseSchema = z.array(MoodCheckInFromApiSchema);

export default function DashboardPage() {
  const t = useTranslations();
  const { user, fetchUserProfile } = useUser();
  const { toast } = useToast();
  const { activePath: currentActivePath } = useActivePath();

  const [isClient, setIsClient] = useState(false);
  const [allMoodCheckIns, setAllMoodCheckIns] = useState<MoodCheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);
  
  const filteredDimensions = useMemo(() => 
    assessmentDimensionsData.filter(dim => {
        const dimIdNum = parseInt(dim.id.replace('dim', ''), 10);
        return dimIdNum <= 13;
    }), []);

  const loadMoodCheckIns = useCallback(async () => {
    if (!user?.id) {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
      const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
      const API_KEY = "4463";
      
      const clave = "SJDFgfds788sdfs8888KLLLL";
      const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
      const raw = `${clave}|${fecha}`;
      const token = Buffer.from(raw).toString('base64');
      const base64UserId = btoa(user.id);
      
      const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getanimo&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`;

      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.statusText}`);
      }
      
      const responseText = await response.text();
      const decryptedData = decryptDataAES(responseText);

      const validation = MoodCheckInsApiResponseSchema.safeParse(decryptedData);

      if (validation.success) {
        const entries = validation.data.map((item, index) => ({
            id: item.id || `mood-${Date.now()}-${index}`,
            mood: item.mood,
            score: item.score,
            timestamp: new Date(item.timestamp.replace(' ', 'T')), // Handle potential space separator
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setAllMoodCheckIns(entries);
      } else {
         console.error("Error validando los datos de ánimo desde la API:", validation.error);
         toast({
            title: "Error de Datos",
            description: "Los datos de estado de ánimo recibidos no son válidos.",
            variant: "destructive",
          });
      }

    } catch (error) {
      console.error("Error cargando los registros de ánimo:", error);
      toast({
        title: "Error al Cargar Registros de Ánimo",
        description: "No se pudieron obtener los registros de estado de ánimo desde WordPress.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    setIsClient(true);
    if (user?.id) {
      loadMoodCheckIns();
      const assessmentHistory = getAssessmentHistory();
      if (assessmentHistory.length > 0) {
        setLatestAssessment(assessmentHistory[0]);
      }
    } else {
        setIsLoading(false);
    }
     if (user && user.id && !user.ageRange) { 
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile, loadMoodCheckIns]);

  const lastMood = useMemo(() => {
    if (allMoodCheckIns.length === 0) return null;
    const latestCheckIn = allMoodCheckIns[0];
    const moodOption = moodCheckInOptions.find(opt => opt.value === latestCheckIn.mood);
    return moodOption ? moodOption.label : null;
  }, [allMoodCheckIns]);

  const chartData = useMemo(() => {
    if (!isClient || !allMoodCheckIns || allMoodCheckIns.length === 0) {
      return [];
    }
    return allMoodCheckIns
      .filter(entry => entry.timestamp)
      .slice(0, 30) // Show last 30 entries
      .map(entry => {
        const moodOption = moodCheckInOptions.find(e => e.value === entry.mood);
        const moodLabel = moodOption ? moodOption.label : entry.mood;
        const entryDate = entry.timestamp as Date; // Now it's always a Date object
        return {
          date: format(entryDate, "dd MMM", { locale: es }),
          moodScore: entry.score,
          emotionLabel: moodLabel,
          fullDate: format(entryDate, "dd MMMM yyyy, HH:mm", { locale: es }),
        };
      }).reverse();
  }, [isClient, allMoodCheckIns]);
  
  const weeklyEntryCount = useMemo(() => {
    if (!isClient) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return allMoodCheckIns.filter(entry => {
        if (!entry.timestamp) return false;
        const entryDate = entry.timestamp as Date;
        return entryDate > oneWeekAgo;
    }).length;
  }, [isClient, allMoodCheckIns]);
  
  const focusArea = useMemo(() => {
    if (!isClient) return "Autoconocimiento";
    return latestAssessment?.data.priorityAreas[0]?.split('(')[0].trim() || "Autoconocimiento";
  }, [isClient, latestAssessment]);

  const activePathProgress = useMemo(() => {
    if (!isClient || !currentActivePath) return { value: "Ninguna", description: "Inicia una ruta desde la sección de Rutas" };
    const progress = currentActivePath.totalModules > 0 ? (currentActivePath.completedModuleIds.length / currentActivePath.totalModules) * 100 : 0;
    return {
      value: `${progress.toFixed(0)}% de ${currentActivePath.title}`,
      description: `${currentActivePath.completedModuleIds.length} de ${currentActivePath.totalModules} módulos completados.`
    };
  }, [isClient, currentActivePath]);

  const pathSuggestion = useMemo(() => {
    if (!isClient || allMoodCheckIns.length < 3) return null; // require at least 3 entries to suggest

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentCheckIns = allMoodCheckIns.filter(entry => {
      if (!entry.timestamp) return false;
      const entryDate = entry.timestamp as Date;
      return entryDate > oneWeekAgo;
    });

    if (recentCheckIns.length < 3) return null; // again, require at least 3 in the last week

    const averageScore = recentCheckIns.reduce((acc, entry) => acc + entry.score, 0) / recentCheckIns.length;

    if (averageScore <= 3) {
      return pathsData.find(p => p.id === 'volver-a-sentirse-bien');
    }

    return null;
  }, [isClient, allMoodCheckIns]);


  if (isLoading || !isClient) {
    return (
      <div className="container mx-auto py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-10">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          {t.welcome}, {user?.name || "Usuarie"}!
        </h1>
        <p className="text-lg text-muted-foreground mt-1">{t.dashboardGreeting}</p>
      </div>

      {pathSuggestion && (
        <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle className="font-semibold">Sugerencia para ti</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  Hemos notado que tu estado de ánimo ha estado algo bajo últimamente. Te sugerimos explorar la ruta de desarrollo <strong>&quot;{pathSuggestion.title}&quot;</strong> para ayudarte a reconectar con tus fuentes de bienestar.
               </div>
               <Button asChild className="w-full sm:w-auto mt-2 sm:mt-0">
                  <Link href={`/paths/${pathSuggestion.id}`}>Ir a la Ruta</Link>
               </Button>
            </AlertDescription>
        </Alert>
      )}

      <section aria-labelledby="quick-summary-heading">
        <h2 id="quick-summary-heading" className="sr-only">{t.quickSummary}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardSummaryCard
            title="Tu Bienestar Hoy"
            value={lastMood || "Estable"}
            description="Basado en tu último registro de ánimo."
            icon={lastMood ? CheckCircle : Smile}
            cardColorClass={lastMood ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700" : "bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700"}
            iconColorClass={lastMood ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}
          />
          <DashboardSummaryCard
            title="Área Prioritaria"
            value={focusArea}
            description="Tu principal área de enfoque según tu última evaluación."
            icon={Target}
            cardColorClass="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
            iconColorClass="text-purple-600 dark:text-purple-400"
          />
          <DashboardSummaryCard
            title="Ruta en Curso"
            value={activePathProgress.value}
            description={activePathProgress.description}
            icon={TrendingUp}
            cardColorClass="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
            iconColorClass="text-blue-600 dark:text-blue-400"
          />
          <DashboardSummaryCard
            title="Registros esta Semana"
            value={`${weeklyEntryCount} ${weeklyEntryCount === 1 ? 'registro' : 'registros'}`}
            description="¡Sigue así para conocerte mejor!"
            icon={Activity}
            cardColorClass="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700"
            iconColorClass="text-yellow-600 dark:text-yellow-500"
          />
        </div>
      </section>

      <section aria-labelledby="visualizations-heading">
        <h2 id="visualizations-heading" className="sr-only">Visualizaciones de Progreso</h2>
        <div className="grid gap-8 lg:grid-cols-2">
            {latestAssessment ? (
                <EmotionalProfileChart 
                    results={latestAssessment.data}
                    assessmentDimensions={filteredDimensions}
                    className="lg:h-[450px]"
                />
            ) : (
                 <ChartPlaceholder
                    title="Realizar Evaluación"
                    description="Completa tu evaluación inicial para desbloquear tu perfil de bienestar y obtener recomendaciones de rutas personalizadas."
                    icon={ClipboardList}
                    className="lg:h-[450px]"
                 />
            )}
          <MoodEvolutionChart
            data={chartData}
            title={t.myEvolution}
            description="Gráfico de tu estado de ánimo general a lo largo del tiempo."
            className="lg:h-[450px]"
          />
        </div>
      </section>
    </div>
  );
}
