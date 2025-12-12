
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { DashboardSummaryCard } from "@/components/dashboard/DashboardSummaryCard";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { EmotionalEntryForm, emotions as emotionOptions } from "@/components/dashboard/EmotionalEntryForm";
import { MoodEvolutionChart } from "@/components/dashboard/MoodEvolutionChart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon, NotebookPen, CheckCircle, Info, UserCircle2, Lock, KeyRound, ShieldQuestion, Trash2, Activity, Send, FileText, RefreshCw, Loader2, ArrowRight, ClipboardList } from "lucide-react";
import { getRecentEmotionalEntries, addEmotionalEntry, formatEntryTimestamp, type EmotionalEntry, getEmotionalEntries, overwriteEmotionalEntries } from "@/data/emotionalEntriesStore";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { encryptDataAES, decryptDataAES, forceEncryptStringAES } from "@/lib/encryption";
import { useActivePath } from "@/contexts/ActivePathContext";
import type { ActivePathDetails as StoredActivePathDetails} from "@/lib/progressStore";
import { pathsData, type Path as AppPathData } from "@/data/pathsData";
import { fetchUserActivities } from "@/actions/user-data";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { getAssessmentHistory, type AssessmentRecord } from "@/data/assessmentHistoryStore";
import { EmotionalProfileChart } from "@/components/dashboard/EmotionalProfileChart";
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { assessmentDimensions as assessmentDimensionsData } from "@/data/assessmentDimensions";


interface ProcessedChartDataPoint {
  date: string;
  moodScore: number;
  emotionLabel: string;
  fullDate: string;
}

interface SingleEmotionalEntryActivity {
  entry: EmotionalEntry;
}


const moodScoreMapping: Record<string, number> = {
  alegria: 5,
  confianza: 5,
  sorpresa: 4,
  anticipacion: 4,
  enfado: 2,
  miedo: 2,
  tristeza: 1,
  asco: 1,
};

const API_BASE_URL_FOR_ACTIVITY_SAVE = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY_FOR_ACTIVITY_SAVE = "4463";
const API_TIMEOUT_MS_ACTIVITY = 10000;
const NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD = 4;

export default function DashboardPage() {
  const t = useTranslations();
  const { user, fetchUserProfile } = useUser(); // Get fetchUserProfile from context
  const { toast } = useToast();
  const { activePath: currentActivePath } = useActivePath();

  const [isClient, setIsClient] = useState(false);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<EmotionalEntry[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [allEntriesForChart, setAllEntriesForChart] = useState<EmotionalEntry[]>([]);
  const [isRefreshingEmotions, setIsRefreshingEmotions] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);
  
  // Effect to fetch the full user profile when the component mounts
  useEffect(() => {
    if (user && user.id && !user.ageRange) { // Check if full profile is missing
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);


  const generateUserActivityApiUrl = useCallback((newEntryData: EmotionalEntry, userIdForUrlParam?: string | null): string => {
    const activityPayload: SingleEmotionalEntryActivity = { entry: newEntryData };
    const jsonPayloadForDatosActividad = encryptDataAES(activityPayload);
    let url = `${API_BASE_URL_FOR_ACTIVITY_SAVE}?apikey=${API_KEY_FOR_ACTIVITY_SAVE}&tipo=guardaractividad&datosactividad=${encodeURIComponent(jsonPayloadForDatosActividad)}`;
    
    if (userIdForUrlParam && typeof userIdForUrlParam === 'string' && userIdForUrlParam.trim() !== '') {
      try {
        const encryptedDirectUserId = forceEncryptStringAES(userIdForUrlParam);
        url += `&userID=${encodeURIComponent(encryptedDirectUserId)}`;
      } catch (encError) {
         console.error("DashboardPage (generateUserActivityApiUrl): Error encriptando userIdForUrlParam con forceEncryptStringAES:", encError);
      }
    }
    return url;
  }, []);


  const loadDataFromStorage = useCallback(() => {
    const loadedRecentEntries = getRecentEmotionalEntries(NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD);
    const loadedAllEntries = getEmotionalEntries(); 
    const assessmentHistory = getAssessmentHistory();
    
    if (assessmentHistory.length > 0) {
        setLatestAssessment(assessmentHistory[0]);
    } else {
        setLatestAssessment(null);
    }

    setRecentEntries(loadedRecentEntries);
    setAllEntriesForChart(loadedAllEntries);

    if (loadedRecentEntries.length > 0) {
        const lastRegisteredEmotion = emotionOptions.find(e => e.value === loadedRecentEntries[0].emotion);
        if (lastRegisteredEmotion) {
            setLastEmotion(t[lastRegisteredEmotion.labelKey as keyof typeof t] || lastRegisteredEmotion.value);
        } else {
            setLastEmotion(null);
        }
    } else {
        setLastEmotion(null);
    }
  }, [t]);

  useEffect(() => {
    // This effect runs only on the client
    setIsClient(true);
    loadDataFromStorage();

    const handleStorageChange = () => loadDataFromStorage();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('emotional-entries-updated', handleStorageChange);
    window.addEventListener('assessment-history-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('emotional-entries-updated', handleStorageChange);
      window.removeEventListener('assessment-history-updated', handleStorageChange);
    };
  }, [loadDataFromStorage]);


  const chartData = useMemo(() => {
    if (!isClient || !allEntriesForChart || allEntriesForChart.length === 0) {
      return [];
    }

    const processedData = allEntriesForChart
      .map(entry => ({
        ...entry,
        timestampDate: new Date(entry.timestamp),
      }))
      .sort((a, b) => a.timestampDate.getTime() - b.timestampDate.getTime())
      .slice(-15)
      .map(entry => {
        const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
        const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
        const moodScore = moodScoreMapping[entry.emotion] ?? 0;
        if (moodScoreMapping[entry.emotion] === undefined) {
            console.warn(`MoodEvolutionChart Data Prep: Emotion string "${entry.emotion}" not found in moodScoreMapping. Defaulting to score 0.`);
        }
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0],
          moodScore: moodScore,
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      });
    return processedData;
  }, [isClient, allEntriesForChart, t]);


  const handleEmotionalEntrySubmit = async (data: { situation: string; thought: string; emotion: string }) => {
    if (!user || !user.id) {
      toast({
        title: "Error de Usuario",
        description: "No se pudo identificar al usuario. Intenta recargar la página o iniciar sesión de nuevo.",
        variant: "destructive",
      });
      console.warn("DashboardPage (handleEmotionalEntrySubmit): User or user.id not available. Cannot submit entry or send to API.");
      return;
    }
    const userIdFromContext = user.id;

    const newEntry = addEmotionalEntry(data);
    loadDataFromStorage();

    toast({
      title: t.emotionalEntrySavedTitle,
      description: t.emotionalEntrySavedMessage,
    });
    setIsEntryDialogOpen(false);

    const currentEncryptedActivityApiUrl = generateUserActivityApiUrl(newEntry, userIdFromContext);

    if (currentEncryptedActivityApiUrl) {
      console.log("DashboardPage (handleEmotionalEntrySubmit): Sending NEW emotional entry to API:", currentEncryptedActivityApiUrl.substring(0,150) + "...");
      try {
        const signal = AbortSignal.timeout(API_TIMEOUT_MS_ACTIVITY);
        const response = await fetch(currentEncryptedActivityApiUrl, { signal });
        const responseText = await response.text();
        if (response.ok) {
          let apiResult;
          try {
            apiResult = JSON.parse(responseText);
            if (apiResult.status === "OK") {
              console.log("DashboardPage (handleEmotionalEntrySubmit): New entry saved successfully to API. Response:", apiResult);
              toast({
                title: "Emoción Sincronizada",
                description: "Tu última entrada emocional ha sido guardada en el servidor.",
                className: "bg-green-50 dark:bg-green-900/30 border-green-500",
                duration: 3000,
              });
            } else {
              console.warn("DashboardPage (handleEmotionalEntrySubmit): API reported 'NOOK' for new entry save. Message:", apiResult.message, "Full Response:", apiResult);
              toast({
                title: "Error de Sincronización",
                description: `La API indicó un problema al guardar la emoción: ${apiResult.message || 'Error desconocido.'}`,
                variant: "destructive",
              });
            }
          } catch (jsonError) {
             console.warn("DashboardPage (handleEmotionalEntrySubmit): Failed to parse JSON response from new entry save API. Raw text:", responseText, jsonError);
             toast({
                title: "Respuesta de Sincronización Inválida",
                description: "La API de actividad devolvió una respuesta inesperada.",
                variant: "destructive",
              });
          }
        } else {
          console.warn("DashboardPage (handleEmotionalEntrySubmit): Failed to save new entry to API. Status:", response.status, "Response Text:", responseText);
          toast({
            title: "Error al Guardar Emoción",
            description: `No se pudo guardar la emoción en el servidor (HTTP ${response.status}).`,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        let errorMessage = "Error de red al guardar la emoción. Verifica la consola del navegador para más detalles.";
        let errorType = "NetworkError";

        if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
            errorMessage = "Tiempo de espera agotado al guardar la emoción en el servidor.";
            errorType = "TimeoutError";
        } else if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
            errorMessage = "Fallo al contactar el servidor (Failed to fetch). Posible problema de CORS o red. Revisa la consola del navegador.";
            errorType = "FetchSetupOrCORSError";
        }

        console.error(`DashboardPage (handleEmotionalEntrySubmit): Error during API call to save new entry. Type: ${errorType}`);
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.stack) {
          console.error("Error Stack:", error.stack);
        }
        console.error("Full Error Object:", error);
        console.error("URL attempted:", currentEncryptedActivityApiUrl);

        toast({
          title: "Error de Conexión con API",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.warn("DashboardPage (handleEmotionalEntrySubmit): No API URL generated for saving new entry. Skipping fetch.");
    }
  };

  const handleRefreshEmotions = async () => {
    if (!user || !user.id) {
      toast({
        title: "Error de Usuario",
        description: "No se puede refrescar sin un usuario identificado.",
        variant: "destructive",
      });
      return;
    }
    setIsRefreshingEmotions(true);
    console.log("DashboardPage (handleRefreshEmotions): Fetching activities for user:", user.id);
    const result = await fetchUserActivities(user.id);
    if (result.success && result.entries) {
      console.log("DashboardPage (handleRefreshEmotions): Successfully fetched activities. Entries count:", result.entries.length);
      overwriteEmotionalEntries(result.entries);
      loadDataFromStorage();
      toast({
        title: "Emociones Actualizadas",
        description: "Se han cargado tus últimos registros emocionales.",
      });
    } else {
      console.warn("DashboardPage (handleRefreshEmotions): Failed to fetch activities. Error:", result.error);
      toast({
        title: "Error al Refrescar",
        description: result.error || "No se pudieron obtener las emociones.",
        variant: "destructive",
      });
    }
    setIsRefreshingEmotions(false);
  };
  
  const weeklyEntryCount = useMemo(() => {
    if (!isClient) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return allEntriesForChart.filter(entry => new Date(entry.timestamp) > oneWeekAgo).length;
  }, [isClient, allEntriesForChart]);
  
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

  if (!isClient) {
    // Render a skeleton or loading state on the server to avoid hydration errors
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

      <section aria-labelledby="quick-summary-heading">
        <h2 id="quick-summary-heading" className="sr-only">{t.quickSummary}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardSummaryCard
            title="Tu Bienestar Hoy"
            value={lastEmotion || "Estable"}
            description="Basado en tu último registro emocional."
            icon={lastEmotion ? CheckCircle : Smile}
            cardColorClass={lastEmotion ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700" : "bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700"}
            iconColorClass={lastEmotion ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}
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

      <>
          <section aria-labelledby="emotional-registry-heading" className="py-6">
            <h2 id="emotional-registry-heading" className="sr-only">{t.emotionalRegistry}</h2>
            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-shadow">
                  <Edit className="mr-3 h-6 w-6" />
                  {t.registerEmotion}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{t.registerEmotionDialogTitle}</DialogTitle>
                  <DialogDescription>
                    {t.registerEmotionDialogDescription}
                  </DialogDescription>
                </DialogHeader>
                <EmotionalEntryForm onSubmit={handleEmotionalEntrySubmit} />
              </DialogContent>
            </Dialog>
          </section>

          <section aria-labelledby="recent-entries-heading">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-accent flex items-center">
                      <NotebookPen className="mr-3 h-6 w-6" />
                      {t.recentEmotionalEntriesTitle}
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRefreshEmotions}
                          disabled={!user || !user.id || isRefreshingEmotions}
                          aria-label="Refrescar emociones"
                        >
                          {isRefreshingEmotions ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refrescar lista de emociones</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                {recentEntries.length > 0 ? (
                  <ul className="space-y-4">
                    {recentEntries.map((entry, index) => {
                      const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
                      const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
                      return (
                        <li key={entry.id} className="p-4 border rounded-lg bg-muted/30 shadow-sm">
                          <p className="text-xs text-muted-foreground">{formatEntryTimestamp(entry.timestamp)}</p>
                          <p className="font-semibold text-primary mt-1">{emotionLabel}</p>
                          <p className="text-sm text-foreground mt-1 truncate" title={entry.situation}>
                            {entry.situation}
                          </p>
                           {index < recentEntries.length - 1 && <Separator className="my-4" />}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic text-center py-4">{t.noRecentEntries}</p>
                )}
              </CardContent>
               {recentEntries.length > 0 && (
                 <CardFooter className="justify-center pt-4">
                    <Button variant="link" asChild>
                        <Link href="/emotional-log">
                            {t.viewAllEntriesButton || "Ver todos los registros"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
               )}
            </Card>
          </section>
        </>

      <section aria-labelledby="visualizations-heading">
        <h2 id="visualizations-heading" className="sr-only">Visualizaciones de Progreso</h2>
        <div className="grid gap-8 lg:grid-cols-2">
            {latestAssessment ? (
                <EmotionalProfileChart 
                    results={latestAssessment.data}
                    assessmentDimensions={assessmentDimensionsData}
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
            description={t.myEvolutionDescription}
            className="lg:h-[450px]"
          />
        </div>
      </section>
    </div>
  );
}
