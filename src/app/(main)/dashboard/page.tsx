
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
import { Smile, TrendingUp, Target, Edit, NotebookPen, CheckCircle, Activity, RefreshCw, Loader2, ArrowRight, ClipboardList, AlertTriangle, MessageSquareQuote, HeartPulse, Brain, Route, BookHeart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useActivePath } from "@/contexts/ActivePathContext";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { getAssessmentHistory, overwriteAssessmentHistory, type AssessmentRecord } from "@/data/assessmentHistoryStore";
import { EmotionalProfileChart } from "@/components/dashboard/EmotionalProfileChart";
import { assessmentDimensions as assessmentDimensionsData } from "@/data/assessmentDimensions";
import type { MoodCheckIn } from "@/types/mood-check-in";
import { moodCheckInOptions } from "@/data/moodCheckInOptions";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmotionalEntryForm } from "@/components/dashboard/EmotionalEntryForm";
import { useDailyCheckIn } from "@/hooks/use-daily-check-in";
import { getAutoregistrosLegacy, saveAutoregistroLegacy } from "@/data/autoregistrosLegacy";
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";

const MoodCheckInObjectSchema = z.object({
  mood: z.string(),
  score: z.coerce.number(),
  timestamp: z.string(),
});
const MoodCheckInsApiResponseSchema = z.array(MoodCheckInObjectSchema);
const ASSESSMENTS_SYNC_TIMEOUT_MS = 20000;

function normalizeDimensionKey(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

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
  const priorityAreasFromPayload = priorityAreasRaw
    .map((item: unknown) => String(item || "").trim())
    .filter(Boolean);
  const fallbackPriorityAreas = Object.entries(emotionalProfile)
    .filter(([name]) => normalizeDimensionKey(name) !== normalizeDimensionKey("Estado Emocional General"))
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => name);
  const priorityAreas = [...new Set([...priorityAreasFromPayload, ...fallbackPriorityAreas])].slice(0, 3);

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

function parseEmotionalEntryTimestamp(timestamp: EmotionalEntry["timestamp"] | null | undefined): Date | null {
  if (!timestamp) return null;
  const parsed = new Date(String(timestamp).replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}


export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();
  const { activePath: currentActivePath } = useActivePath();
  const { forceOpen: forceDailyCheckInOpen } = useDailyCheckIn();

  const [isClient, setIsClient] = useState(false);
  const [allMoodCheckIns, setAllMoodCheckIns] = useState<MoodCheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugUrl, setDebugUrl] = useState<string | null>(null);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [allEntries, setAllEntries] = useState<EmotionalEntry[]>([]);
  
  const filteredDimensions = useMemo(() => 
    assessmentDimensionsData.filter(dim => {
        const dimIdNum = parseInt(dim.id.replace('dim', ''), 10);
        return dimIdNum <= 13;
    }), []);

  const handleEmotionalEntrySubmit = async (data: { situation: string; thought: string; emotion: string }) => {
    if (!user?.id) {
      toast({
        title: "Error de Usuario o Conexión",
        description: "No se pudo identificar al usuario.",
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
    } catch (_error) {
      toast({ title: "Error al Guardar", description: "No se pudo guardar el registro.", variant: "destructive" });
    }
  };

  const loadEntries = useCallback(async () => {
    if (!user?.id) {
      setAllEntries([]);
      return;
    }

    try {
      const entries = await getAutoregistrosLegacy(user.id);
      setAllEntries(entries);
    } catch (error) {
      console.error("Error cargando autorregistros:", error);
    }
  }, [user?.id]);

  const loadMoodCheckIns = useCallback(async () => {
    if (!user?.id) {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    setError(null); 
    setDebugUrl(null);
    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
      const response = await fetch(
        `${base}/mood-check-ins?userId=${encodeURIComponent(user.id)}`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error del servidor (HTTP ${response.status}): ${text.substring(0, 150)}`);
      }

      const payload = await response.json();
      setDebugUrl(payload?.debugUrl || null);
      const validation = MoodCheckInsApiResponseSchema.safeParse(payload?.entries ?? []);
      if (validation.success) {
        const entries = validation.data.map((item) => ({
          id: `mood-${new Date(item.timestamp).getTime()}`,
          mood: item.mood,
          score: item.score,
          timestamp: new Date(item.timestamp.replace(' ', 'T')),
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setAllMoodCheckIns(entries);
      } else {
        throw new Error("Error validando los datos de animo desde el backend.");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Ocurrió un error desconocido al cargar los registros.";
      console.error("Error cargando los registros de ánimo:", error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const loadLatestAssessment = useCallback(async () => {
    const localHistory = getAssessmentHistory(user?.id);
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
        overwriteAssessmentHistory(normalized, user.id);
        setLatestAssessment(normalized[0]);
      }
    } catch {
      // Keep local fallback silently.
    }
  }, [user?.id]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadEntries();
      loadMoodCheckIns();
      loadLatestAssessment();
    } else {
      setIsLoading(false);
      setAllEntries([]);
    }
  }, [user?.id, loadEntries, loadMoodCheckIns, loadLatestAssessment]);

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
        const entryDate = entry.timestamp as Date;
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
    return allEntries.filter((entry) => {
        const entryDate = parseEmotionalEntryTimestamp(entry.timestamp);
        return !!entryDate && entryDate > oneWeekAgo;
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

       {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error al Cargar Datos del Ánimo</AlertTitle>
            <AlertDescription>
                <p>No se pudieron obtener los datos para la gráfica de evolución.</p>
                <details className="mt-2 text-xs whitespace-pre-wrap">
                  <summary>Detalles técnicos</summary>
                  <p><strong>URL de la llamada:</strong> {debugUrl || 'No disponible'}</p>
                  <p><strong>Error:</strong> {error}</p>
                </details>
            </AlertDescription>
        </Alert>
      )}

      <section aria-labelledby="quick-summary-heading">
        <h2 id="quick-summary-heading" className="sr-only">{t.quickSummary}</h2>
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          <DashboardSummaryCard
            title="Tu Bienestar Hoy"
            value={lastMood || "Estable"}
            description="Basado en tu último registro de ánimo."
            icon={HeartPulse}
            cardColorClass={lastMood ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700" : "bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700"}
            iconColorClass={lastMood ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}
          />
          <DashboardSummaryCard
            title="Área Prioritaria"
            value={focusArea}
            description="Tu principal área de enfoque según tu última evaluación."
            icon={Brain}
            cardColorClass="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
            iconColorClass="text-purple-600 dark:text-purple-400"
          />
          <DashboardSummaryCard
            title="Ruta en Curso"
            value={activePathProgress.value}
            description={activePathProgress.description}
            icon={Route}
            cardColorClass="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
            iconColorClass="text-blue-600 dark:text-blue-400"
          />
          <DashboardSummaryCard
            title="Autorregistros esta Semana"
            value={`${weeklyEntryCount} ${weeklyEntryCount === 1 ? 'autorregistro' : 'autorregistros'}`}
            description="¡Sigue así para conocerte mejor!"
            ctaLink="/resources/post/autorregistro-el-habito-que-cambia-como-piensas-como-sientes-y-como-actuas"
            ctaLabel="¿Qué es el autoregistro?"
            icon={BookHeart}
            cardColorClass="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700"
            iconColorClass="text-yellow-600 dark:text-yellow-500"
          />
        </div>
      </section>

      <section aria-labelledby="emotional-registry-heading" className="py-6">
        <h2 id="emotional-registry-heading" className="sr-only">{t.emotionalRegistry}</h2>
        <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-shadow">
              <Edit className="mr-3 h-6 w-6" />
              {t.registerEmotion}
            </Button>
          </DialogTrigger>
          <DialogContent className="flex w-[calc(100%-1rem)] max-w-[480px] max-h-[calc(100dvh-1rem)] flex-col overflow-hidden p-4 sm:p-6">
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-2xl">{t.registerEmotionDialogTitle}</DialogTitle>
              <DialogDescription>
                {t.registerEmotionDialogDescription}
              </DialogDescription>
            </DialogHeader>
            <EmotionalEntryForm onSubmit={handleEmotionalEntrySubmit} />
          </DialogContent>
        </Dialog>
      </section>

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
