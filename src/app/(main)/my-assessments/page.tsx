
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAssessmentTimestamp, type AssessmentRecord, overwriteAssessmentHistory, getAssessmentHistory as getLocalAssessmentHistory } from '@/data/assessmentHistoryStore';
import { History, Eye, ArrowRight, Loader2, AlertTriangle, RefreshCw, PlaySquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { forceEncryptStringAES, decryptDataAES } from '@/lib/encryption';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';

// API constants
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 20000;
const IN_PROGRESS_ANSWERS_KEY = 'workwell-assessment-in-progress';

// Zod schema for validating the structure of a single assessment record from the API
const ApiSingleAssessmentRecordSchema = z.object({
  id: z.string(),
  timestamp: z.string().refine((val) => {
    const parsedDate = Date.parse(val);
    if (!isNaN(parsedDate)) return true;
    try {
        return !isNaN(new Date(val).getTime());
    } catch (e) {
        return false;
    }
  }, {
    message: "Timestamp must be a valid date string",
  }),
  data: z.object({
    emotionalProfile: z.union([
      z.record(z.string(), z.number().min(1).max(5)),
      z.array(z.any())
    ]).transform((profile, ctx) => {
      if (Array.isArray(profile)) {
        const newRecord: Record<string, number> = {};
        for (const item of profile) {
          if (Array.isArray(item) && item.length === 3 && typeof item[1] === 'string' && (typeof item[2] === 'string' || typeof item[2] === 'number')) {
            const dimensionName = item[1];
            const scoreValue = typeof item[2] === 'string' ? parseFloat(item[2]) : item[2];
            if (!isNaN(scoreValue) && scoreValue >= 1 && scoreValue <= 5) {
              newRecord[dimensionName] = scoreValue;
            }
          } else if (Array.isArray(item) && item.length === 2 && typeof item[0] === 'string' && (typeof item[1] === 'string' || typeof item[1] === 'number')) {
            const dimensionName = item[0];
            const scoreValue = typeof item[1] === 'string' ? parseFloat(item[1]) : item[1];
             if (!isNaN(scoreValue) && scoreValue >= 1 && scoreValue <= 5) {
              newRecord[dimensionName] = scoreValue;
            }
          } else if (typeof item === 'object' && item !== null && 'dimensionName' in item && 'score' in item) {
            const objItem = item as { dimensionName: string, score: string | number };
             const scoreValue = typeof objItem.score === 'string' ? parseFloat(objItem.score) : objItem.score;
             if (typeof objItem.dimensionName === 'string' && !isNaN(scoreValue) && scoreValue >= 1 && scoreValue <= 5) {
               newRecord[objItem.dimensionName] = scoreValue;
            }
          } else {
            continue;
          }
        }
        if (Object.keys(newRecord).length === 0 && profile.length > 0) {
           ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `The emotionalProfile array did not contain any items that could be parsed into a valid record. Original array: ${JSON.stringify(profile)}`,
           });
           return z.NEVER;
        }
        return newRecord;
      }
      return profile;
    }),
    priorityAreas: z.array(z.any()).optional().nullable().transform((val, ctx) => {
        if (!val) return [];
        const flattened = val.flat();
        const stringArraySchema = z.array(z.string());
        const result = stringArraySchema.safeParse(flattened);
        if (result.success) {
            return result.data.slice(0, 3);
        } else {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Priority areas could not be transformed into an array of strings. Original value: ${JSON.stringify(val)}`,
            });
            return z.NEVER;
        }
    }),
    feedback: z.string().min(1, "El feedback no puede estar vacío."),
    respuestas: z.union([z.record(z.string(), z.number()), z.array(z.any())]).optional().nullable().transform(val => {
      if (Array.isArray(val) && val.length === 0) {
        return null; 
      }
      if (typeof val === 'object' && !Array.isArray(val)) {
        return val;
      }
      return null;
    }),
  }),
});


const ApiFetchedAssessmentsSchema = z.array(ApiSingleAssessmentRecordSchema);

interface ExternalApiResponse {
  status: "OK" | "NOOK";
  message: string;
  data: any;
}

export default function MyAssessmentsPage() {
  const t = useTranslations();
  const { user, loading: userLoading } = useUser();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInProgress, setHasInProgress] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const savedProgress = localStorage.getItem(IN_PROGRESS_ANSWERS_KEY);
            if(savedProgress) {
                const parsedData = JSON.parse(savedProgress);
                setHasInProgress(!!parsedData && !!parsedData.answers && Object.keys(parsedData.answers).length > 0);
            } else {
                setHasInProgress(false);
            }
        } catch(e) {
            console.error("Error checking in-progress assessment:", e);
            setHasInProgress(false);
        }
    }
  }, [user]);

  const fetchAssessments = useCallback(async () => {
    if (!user || !user.id) {
      setError(t.errorOccurred + " (Usuario no autenticado o ID de usuario no disponible para la API)");
      setIsLoading(false);
      console.warn("MyAssessmentsPage: Fetch aborted. User or user.id is not available.", "User:", user);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // --- OPTIMISTIC UI: Cargar datos locales primero ---
    const localAssessments = getLocalAssessmentHistory();
    setAssessments(localAssessments);
    // ---

    let constructedApiUrl = "";
    try {
      const encryptedUserId = forceEncryptStringAES(user.id);
      constructedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getEvaluacion&usuario=${encodeURIComponent(encryptedUserId)}`;
      
      const response = await fetch(constructedApiUrl, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
      let responseText = await response.text();

      // ... (El resto de la lógica para parsear var_dump y JSON permanece igual)
      let jsonToParse = responseText;
      const varDumpRegex = /^string\(\d+\)\s*"([\s\S]*)"\s*$/;
      const match = responseText.match(varDumpRegex);
      if (match && match[1]) {
        jsonToParse = match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }

      if (!response.ok) {
        throw new Error(`${t.errorOccurred} (HTTP ${response.status}): ${response.statusText || jsonToParse.substring(0,100) || 'Error del servidor'}`);
      }

      const apiResult: ExternalApiResponse = JSON.parse(jsonToParse);
      
      if (apiResult.status === "OK") {
        let potentialAssessmentsArray: any = null;

        if (Array.isArray(apiResult.data)) {
          potentialAssessmentsArray = apiResult.data;
        } else if (typeof apiResult.data === 'string' && apiResult.data.trim() !== '') {
          const decryptedData = decryptDataAES(apiResult.data);
          if (decryptedData && Array.isArray(decryptedData)) {
            potentialAssessmentsArray = decryptedData;
          }
        } else {
          potentialAssessmentsArray = [];
        }

        const validationResult = ApiFetchedAssessmentsSchema.safeParse(potentialAssessmentsArray);
        if (validationResult.success) {
          const serverAssessments = validationResult.data.map(record => {
              const dateObj = new Date(record.timestamp.includes('T') ? record.timestamp : record.timestamp.replace(' ', 'T'));
              return { ...record, timestamp: isNaN(dateObj.getTime()) ? record.timestamp : dateObj.toISOString() };
          });

          // --- MERGE LOGIC ---
          const allAssessmentsMap = new Map<string, AssessmentRecord>();
          localAssessments.forEach(record => allAssessmentsMap.set(record.id, record));
          serverAssessments.forEach(record => allAssessmentsMap.set(record.id, record));
          
          const mergedAssessments = Array.from(allAssessmentsMap.values()).sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          setAssessments(mergedAssessments);
          overwriteAssessmentHistory(mergedAssessments);
          // --- END MERGE LOGIC ---

        } else {
          console.error("MyAssessmentsPage: Zod validation failed.", validationResult.error);
          setError(t.errorOccurred + " (Datos de evaluación recibidos no son válidos)");
        }
      } else {
        if (apiResult.message && apiResult.message.toLowerCase().includes("no hay evaluaciones")) {
            setAssessments([]); 
            overwriteAssessmentHistory([]);
        } else {
            setError(`${t.errorOccurred}: ${apiResult.message || 'Error desconocido del servidor'}`);
        }
      }
    } catch (e: any) {
      console.error("MyAssessmentsPage: Error fetching or processing assessments:", e);
      // En caso de error de red, nos quedamos con los datos locales que ya cargamos
      setError("No se pudieron sincronizar las evaluaciones. Mostrando datos guardados en el dispositivo.");
    } finally {
      setIsLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (!userLoading && user && user.id) { 
      fetchAssessments();
    } else if (!userLoading && (!user || !user.id)) {
      setIsLoading(false);
      setAssessments([]); // Limpiar evaluaciones si no hay usuario
      setError(t.errorOccurred + " (Debes iniciar sesión y tener un ID de usuario para ver tus evaluaciones)");
      console.warn("MyAssessmentsPage: User not loaded or user.id missing. User:", user);
    }
  }, [user, userLoading, fetchAssessments]);

  if (userLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 text-center sm:text-left">
        <div>
          <History className="mx-auto sm:mx-0 h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-3">{t.myAssessmentsTitle}</h1>
          <p className="text-lg text-muted-foreground">{t.myAssessmentsDescription}</p>
        </div>
        <Button onClick={fetchAssessments} variant="outline" disabled={isLoading || !user || !user.id}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasInProgress && (
        <Card className="mb-8 shadow-lg border-primary bg-primary/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <PlaySquare className="mr-2 h-5 w-5" />
              Evaluación en Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Detectamos que tienes una evaluación guardada sin finalizar. Puedes continuar donde la dejaste.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/assessment/guided">Continuar Evaluación</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {assessments.length === 0 && !isLoading && !error && !hasInProgress && (
        <Card className="max-w-lg mx-auto text-center shadow-lg">
          <CardHeader>
            <CardTitle>{t.noAssessmentsFound}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Parece que aún no has completado ninguna evaluación o no se pudieron cargar. Intenta refrescar o realiza una nueva.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/assessment/intro">
                {t.takeInitialAssessment} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {assessments.length > 0 && (
        <div className="space-y-8">
          {assessments.map((assessment) => {
            return (
              <Card key={assessment.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                          {formatAssessmentTimestamp(assessment.timestamp)}
                      </Badge>
                      <History className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-accent">{t.assessmentDateLabel.replace("{date}", formatAssessmentTimestamp(assessment.timestamp).split(',')[0])}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground line-clamp-3">
                    {assessment.data.feedback}
                  </p>
                </CardContent>
                <CardFooter className="flex-col items-stretch space-y-4">
                  <Button asChild variant="default" className="w-full">
                    <Link href={`/assessment/history-results/${assessment.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t.viewAssessmentResultsButton}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}

