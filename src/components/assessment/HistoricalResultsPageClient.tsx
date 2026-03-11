"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AssessmentResultsDisplay } from "@/components/assessment/AssessmentResultsDisplay";
import { useTranslations } from "@/lib/translations";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssessmentById, type AssessmentRecord } from "@/data/assessmentHistoryStore";
import { useUser } from "@/contexts/UserContext";
import type { AssessmentDimension } from "@/data/paths/pathTypes";
import { useToast } from "@/hooks/use-toast";
import { assessmentDimensions as assessmentDimensionsData } from "@/data/assessmentDimensions";

export function HistoricalResultsPageClient() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id") || "";
  const { toast } = useToast();

  const [assessmentRecord, setAssessmentRecord] = useState<AssessmentRecord | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentDimensions, setAssessmentDimensions] = useState<AssessmentDimension[]>([]);
  const [rawAnswersWithWeight, setRawAnswersWithWeight] =
    useState<Record<string, { score: number; weight: number }> | null>(null);

  useEffect(() => {
    const processData = async () => {
      setIsLoading(true);
      if (!assessmentId) {
        setError("ID de evaluacion no proporcionado.");
        setIsLoading(false);
        setAssessmentRecord(null);
        return;
      }

      try {
        const dimensions = assessmentDimensionsData.filter((dim) => {
          const dimIdNum = parseInt(dim.id.replace("dim", ""), 10);
          return dimIdNum <= 13;
        });
        const record = getAssessmentById(assessmentId);

        setAssessmentDimensions(dimensions);

        if (record) {
          setAssessmentRecord(record);

          if (record.data.respuestas && dimensions.length > 0) {
            const processedAnswers = Object.entries(record.data.respuestas).reduce((acc, [key, value]) => {
              let weight = 1;
              for (const dim of dimensions) {
                const item = dim.items.find((i) => i.id === key);
                if (item) {
                  weight = item.weight;
                  break;
                }
              }
              acc[key] = { score: value, weight };
              return acc;
            }, {} as Record<string, { score: number; weight: number }>);
            setRawAnswersWithWeight(processedAnswers);
          }
        } else {
          setError(`No se encontro una evaluacion con el ID: ${assessmentId}.`);
          setAssessmentRecord(null);
        }
      } catch (e) {
        console.error("HistoricalAssessmentResultsPage: Error loading assessment data:", e);
        const errorMessage = e instanceof Error ? e.message : "Error desconocido al cargar los datos.";
        setError(`Error al cargar los resultados de la evaluacion historica: ${errorMessage}`);
        setAssessmentRecord(null);
        toast({
          title: "Error de carga",
          description: "No se pudieron cargar los datos necesarios para mostrar la evaluacion.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    processData();
  }, [assessmentId, toast]);

  const handleRetakeAssessment = () => {
    router.push("/assessment/intro");
  };

  const handleViewHistory = () => {
    router.push("/my-assessments");
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !assessmentRecord) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive">{t.errorOccurred}</p>
        <p className="text-muted-foreground">{error || "No se pudo cargar la evaluacion."}</p>
        <div className="mt-6 space-x-4">
          <Button onClick={handleViewHistory} variant="outline">
            Volver al historial
          </Button>
          <Button onClick={handleRetakeAssessment}>{t.takeInitialAssessment}</Button>
        </div>
      </div>
    );
  }

  const resultsForDisplay = {
    emotionalProfile: assessmentRecord.data.emotionalProfile,
    priorityAreas: assessmentRecord.data.priorityAreas,
    feedback: assessmentRecord.data.feedback,
  };

  return (
    <div className="container mx-auto py-8">
      <AssessmentResultsDisplay
        results={resultsForDisplay}
        rawAnswers={rawAnswersWithWeight}
        userId={user?.id}
        onRetake={handleRetakeAssessment}
        assessmentTimestamp={assessmentRecord.timestamp}
        assessmentDimensions={assessmentDimensions}
      />
      <div className="mt-8 text-center">
        <Button onClick={handleViewHistory} variant="outline">
          Volver al historial de evaluaciones
        </Button>
      </div>
    </div>
  );
}

