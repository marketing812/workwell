
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
import { Smile, TrendingUp, Target, Edit, NotebookPen, CheckCircle, Activity, RefreshCw, Loader2, ArrowRight, ClipboardList, FileJson } from "lucide-react";
import { formatEntryTimestamp, type EmotionalEntry } from "@/data/emotionalEntriesStore";
import { Separator } from "@/components/ui/separator";
import { useActivePath } from "@/contexts/ActivePathContext";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { getAssessmentHistory, overwriteAssessmentHistory, type AssessmentRecord } from "@/data/assessmentHistoryStore";
import { EmotionalProfileChart } from "@/components/dashboard/EmotionalProfileChart";
import { assessmentDimensions as assessmentDimensionsData } from "@/data/assessmentDimensions";
import { getAutoregistrosLegacy, saveAutoregistroLegacy } from "@/data/autoregistrosLegacy";

const DEBUG_REGISTER_FETCH_URL_KEY = "workwell-debug-register-fetch-url";
const DEBUG_SAVE_NOTEBOOK_URL_KEY = "workwell-debug-save-notebook-url";
const ASSESSMENTS_SYNC_TIMEOUT_MS = 20000;


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

const NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD = 4;

function normalizeEmotionalProfile(rawProfile: any): Record<string, number> {
  if (!rawProfile) return {};

  if (Array.isArray(rawProfile)) {
    const parsed: Record<string, number> = {};
    rawProfile.forEach((item) => {
      if (Array.isArray(item) && item.length >= 3 && typeof item[1] === "string") {
        const score = Number(item[2]);
        if (Number.isFinite(score)) parsed[item[1]] = score;
        return;
      }
      if (Array.isArray(item) && item.length >= 2 && typeof item[0] === "string") {
        const score = Number(item[1]);
        if (Number.isFinite(score)) parsed[item[0]] = score;
      }
    });
    return parsed;
  }

  if (typeof rawProfile === "object") {
    return Object.entries(rawProfile).reduce((acc, [key, value]) => {
      const score = Number(value);
      if (Number.isFinite(score)) acc[key] = score;
      return acc;
    }, {} as Record<string, number>);
  }

  return {};
}

function normalizeRespuestas(rawRespuestas: any): Record<string, number> | null {
  if (!rawRespuestas) return null;
  if (Array.isArray(rawRespuestas)) return null;
  if (typeof rawRespuestas !== "object") return null;

  const parsed = Object.entries(rawRespuestas).reduce((acc, [key, value]) => {
    const score = Number(value);
    if (Number.isFinite(score)) acc[key] = score;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(parsed).length > 0 ? parsed : null;
}

function normalizeAssessmentEntry(raw: any, index: number): AssessmentRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const rawData = raw.data && typeof raw.data === "object" ? raw.data : {};
  const emotionalProfile = normalizeEmotionalProfile(rawData.emotionalProfile);
  if (Object.keys(emotionalProfile).length === 0) return null;

  const timestamp = String(raw.timestamp || raw.fecha || raw.createdAt || new Date().toISOString());
  const id = String(raw.id || `assessment-${Date.now()}-${index}`);
  const priorityAreasRaw = Array.isArray(rawData.priorityAreas) ? rawData.priorityAreas.flat(Infinity) : [];
  const priorityAreas = priorityAreasRaw
    .map((item: unknown) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    id,
    timestamp,
    data: {
      emotionalProfile,
      priorityAreas,
      feedback: String(rawData.feedback || ""),
      respuestas: normalizeRespuestas(rawData.respuestas),
    },
  };
}

export default function DashboardPage() {
  const t = useTranslations();
  const { user, fetchUserProfile } = useUser();
  const { toast } = useToast();
  const { activePath: currentActivePath } = useActivePath();

  const [isClient, setIsClient] = useState(false);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<EmotionalEntry[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [allEntries, setAllEntries] = useState<EmotionalEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);
  
  const filteredDimensions = useMemo(() => 
    assessmentDimensionsData.filter(dim => {
        const dimIdNum = parseInt(dim.id.replace('dim', ''), 10);
        return dimIdNum <= 13;
    }), []);

  const loadEntries = useCallback(async () => {
    if (!user?.id) {
        setIsLoadingEntries(false);
        return;
    };
    setIsLoadingEntries(true);
    try {
      const entries = await getAutoregistrosLegacy(user.id);

      setAllEntries(entries);
      setRecentEntries(entries.slice(0, NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD));
      if (entries.length > 0 && entries[0].emotion) {
        const lastRegisteredEmotion = emotionOptions.find(e => e.value === entries[0].emotion);
        setLastEmotion(lastRegisteredEmotion ? t[lastRegisteredEmotion.labelKey as keyof typeof t] || lastRegisteredEmotion.value : null);
      } else {
        setLastEmotion(null);
      }
    } catch (error) {
      console.error("Error loading initial emotions:", error);
      toast({
        title: "Error al Cargar Emociones",
        description: "No se pudieron obtener los registros emocionales.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEntries(false);
    }
  }, [user?.id, t, toast]);

  const loadLatestAssessment = useCallback(async () => {
    const localHistory = getAssessmentHistory();
    if (localHistory.length > 0) {
      setLatestAssessment(localHistory[0]);
    }

    if (!user?.id) return;

    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
      const response = await fetch(
        `${base}/assessments?userId=${encodeURIComponent(user.id)}`,
        { signal: AbortSignal.timeout(ASSESSMENTS_SYNC_TIMEOUT_MS), cache: "no-store" }
      );
      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      const rawEntries: unknown[] = Array.isArray(payload?.entries) ? payload.entries : [];
      const normalized = rawEntries
        .map((entry: unknown, index: number) => normalizeAssessmentEntry(entry, index))
        .filter((entry): entry is AssessmentRecord => !!entry)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (normalized.length > 0) {
        overwriteAssessmentHistory(normalized);
        setLatestAssessment(normalized[0]);
      }
    } catch {
      // Keep local fallback silently.
    }
  }, [user?.id]);

  useEffect(() => {
    setIsClient(true);
    if (user?.id) {
      loadEntries();
      loadLatestAssessment();
    } else {
        setIsLoadingEntries(false);
    }
     if (user && user.id && !user.ageRange) { 
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile, loadEntries, loadLatestAssessment]);


  const chartData = useMemo(() => {
    if (!isClient || !allEntries || allEntries.length === 0) {
      return [];
    }
    return allEntries
      .filter(entry => entry.timestamp)
      .slice(0, 15)
      .map(entry => {
        const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
        const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
        const moodScore = moodScoreMapping[entry.emotion] ?? 0;
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0],
          moodScore: moodScore,
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      }).reverse();
  }, [isClient, allEntries, t]);


  const handleEmotionalEntrySubmit = async (data: { situation: string; thought: string; emotion: string }) => {
    if (!user?.id) {
      toast({
        title: "Error de Usuario o Conexión",
        description: "No se pudo identificar al usuario. Intenta recargar la página.",
        variant: "destructive",
      });
      return;
    }

    setIsEntryDialogOpen(false);

    try {
      const result = await saveAutoregistroLegacy({
        userId: user.id,
        entry: data,
      });

      if (!result.success) {
        toast({ title: "Error al Guardar", description: result.message, variant: "destructive" });
        return;
      }

      toast({
        title: t.emotionalEntrySavedTitle,
        description: "Tu autorregistro se ha guardado.",
      });

      await loadEntries();
    } catch (error) {
      console.error("Error saving emotional entry via web service:", error);
      toast({
        title: "Error al Guardar",
        description: "No se pudo guardar tu autorregistro.",
        variant: "destructive",
      });
    }
  };
  const weeklyEntryCount = useMemo(() => {
    if (!isClient) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return allEntries.filter(entry => {
        if (!entry.timestamp) return false;
        const entryDate = typeof entry.timestamp === 'string' ? new Date(entry.timestamp) : entry.timestamp;
        const dateToCompare = typeof entryDate === 'string' ? new Date(entryDate) : entryDate;
        return dateToCompare > oneWeekAgo;
    }).length;
  }, [isClient, allEntries]);
  
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
            ctaLink="/resources/post/autorregistro-el-habito-que-cambia-como-piensas-como-sientes-y-como-actuas"
            ctaLabel="¿Qué es el autoregistro?"
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
              <DialogContent className="w-[calc(100%-1rem)] max-w-[480px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
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
                          onClick={loadEntries}
                          disabled={!user || !user.id || isLoadingEntries}
                          aria-label="Refrescar emociones"
                        >
                          {isLoadingEntries ? (
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
                {isLoadingEntries ? (
                   <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : recentEntries.length > 0 ? (
                  <ul className="space-y-4">
                    {recentEntries.map((entry, index) => {
                      const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
                      const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
                      return (
                        <li key={entry.id} className="p-4 border rounded-lg bg-muted/30 shadow-sm">
                          <p className="text-xs text-muted-foreground">{formatEntryTimestamp(entry.timestamp)}</p>
                          <p className="font-semibold text-primary mt-1">{emotionLabel}</p>
                          <p className="text-sm text-foreground mt-1 truncate" title={entry.thought}>
                            {entry.thought}
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
               {allEntries.length > 0 && (
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
                    rawAnswers={latestAssessment.data.respuestas ?? null}
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
