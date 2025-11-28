
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAssessmentTimestamp, type AssessmentRecord, overwriteAssessmentHistory } from '@/data/assessmentHistoryStore'; // Import overwriteAssessmentHistory
import { History, Eye, ListChecks, ArrowRight, Loader2, AlertTriangle, RefreshCw, FileJson, PlaySquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { forceEncryptStringAES, decryptDataAES } from '@/lib/encryption';
import { z } from 'zod';
import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// API constants
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 20000;
const IN_PROGRESS_ANSWERS_KEY = 'workwell-assessment-in-progress';

// Zod schema for validating the structure of a single assessment record from the API
const ApiSingleAssessmentRecordSchema = z.object({
  id: z.string(),
  timestamp: z.string().refine((val) => {
    // Try parsing with Date.parse first, as it's more lenient with "YYYY-MM-DD HH:MM:SS"
    const parsedDate = Date.parse(val);
    if (!isNaN(parsedDate)) return true;
    // Fallback to try parsing as full ISO string if Date.parse failed
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
      z.array(z.any()) // Start with a generic array
    ]).transform((profile, ctx) => {
      if (Array.isArray(profile)) {
        const newRecord: Record<string, number> = {};
        for (const item of profile) {
          if (Array.isArray(item) && item.length === 3 && typeof item[1] === 'string' && (typeof item[2] === 'string' || typeof item[2] === 'number')) {
            // Handles ["id", "Dimension Name", "score_string"]
            const dimensionName = item[1];
            const scoreValue = typeof item[2] === 'string' ? parseFloat(item[2]) : item[2];
            if (!isNaN(scoreValue) && scoreValue >= 1 && scoreValue <= 5) {
              newRecord[dimensionName] = scoreValue;
            }
          } else if (Array.isArray(item) && item.length === 2 && typeof item[0] === 'string' && (typeof item[1] === 'string' || typeof item[1] === 'number')) {
            // Handles ["Dimension Name", score_number] or ["Dimension Name", "score_string"]
            const dimensionName = item[0];
            const scoreValue = typeof item[1] === 'string' ? parseFloat(item[1]) : item[1];
             if (!isNaN(scoreValue) && scoreValue >= 1 && scoreValue <= 5) {
              newRecord[dimensionName] = scoreValue;
            }
          } else if (typeof item === 'object' && item !== null && 'dimensionName' in item && 'score' in item) {
             // Handles { dimensionName: "...", score: ... }
            const objItem = item as { dimensionName: string, score: string | number };
             const scoreValue = typeof objItem.score === 'string' ? parseFloat(objItem.score) : objItem.score;
             if (typeof objItem.dimensionName === 'string' && !isNaN(scoreValue) && scoreValue >= 1 && scoreValue <= 5) {
               newRecord[objItem.dimensionName] = scoreValue;
            }
          } else {
            // If none of the structures match, we can ignore or add an issue
            // For now, we'll just ignore malformed items within the array
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
      // If it's already an object, just pass it through
      return profile;
    }),
    priorityAreas: z.array(z.any()).optional().nullable().transform((val, ctx) => {
        if (!val) return [];
        // Aplanar el array si viene anidado (ej. [['Area1'], ['Area2']])
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
        return null; // Transform empty array to null
      }
      if (typeof val === 'object' && !Array.isArray(val)) {
        return val; // It's already an object, pass through
      }
      return null; // In any other case (like a non-empty array we don't expect), treat as null
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient, user]);

  const fetchAssessments = useCallback(async () => {
    if (!user || !user.id) {
      setError(t.errorOccurred + " (Usuario no autenticado o ID de usuario no disponible para la API)");
      setIsLoading(false);
      console.warn("MyAssessmentsPage: Fetch aborted. User or user.id is not available.", "User:", user);
      return;
    }

    setIsLoading(true);
    setError(null);

    const currentUserId = user.id;
    console.log("MyAssessmentsPage: Preparing to fetch assessments for user.id:", currentUserId);

    let constructedApiUrl = "";
    try {
      const encryptedUserId = forceEncryptStringAES(currentUserId);
      
      constructedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getEvaluacion&usuario=${encodeURIComponent(encryptedUserId)}`;
      console.log("MyAssessmentsPage: Fetching assessments from URL (first 150 chars):", constructedApiUrl.substring(0,150) + "...");

      const signal = AbortSignal.timeout(API_TIMEOUT_MS);
      
      const response = await fetch(constructedApiUrl, { signal });
      let responseText = await response.text();
      
      let jsonToParse = responseText;
      const varDumpRegex = /^string\(\d+\)\s*"([\s\S]*)"\s*$/;
      const match = responseText.match(varDumpRegex);

      if (match && match[1]) {
        jsonToParse = match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }


      if (!response.ok) {
        throw new Error(`${t.errorOccurred} (HTTP ${response.status}): ${response.statusText || jsonToParse.substring(0,100) || 'Error del servidor'}`);
      }
      
      let apiResult: ExternalApiResponse;
      try {
        apiResult = JSON.parse(jsonToParse);
      } catch (jsonError: any) {
        setError(t.errorOccurred + " (Respuesta del servidor no es JSON válido. Revisa la consola del navegador para ver la respuesta cruda del servidor.)");
        setIsLoading(false);
        return;
      }

      if (apiResult.status === "OK") {
        let potentialAssessmentsArray: any = null;

        if (Array.isArray(apiResult.data)) {
          potentialAssessmentsArray = apiResult.data;
        } else if (typeof apiResult.data === 'string' && apiResult.data.trim() !== '') {
          const decryptedData = decryptDataAES(apiResult.data);
          if (decryptedData && Array.isArray(decryptedData)) {
            potentialAssessmentsArray = decryptedData;
          } else {
            potentialAssessmentsArray = decryptedData; 
          }
        } else if (apiResult.data === null || (typeof apiResult.data === 'string' && (apiResult.data.trim() === '' || apiResult.data.trim() === "[]" || apiResult.data.toLowerCase().includes("no hay evaluaciones")))) {
            potentialAssessmentsArray = [];
        }

        if (potentialAssessmentsArray !== null && potentialAssessmentsArray !== undefined) { 
          const validationResult = ApiFetchedAssessmentsSchema.safeParse(potentialAssessmentsArray);
          if (validationResult.success) {
            const processedAssessments = validationResult.data.map(record => {
                try {
                    const dateObj = new Date(record.timestamp.includes('T') ? record.timestamp : record.timestamp.replace(' ', 'T'));
                    if (isNaN(dateObj.getTime())) {
                        return record;
                    }
                    return { ...record, timestamp: dateObj.toISOString() };
                } catch (e) {
                    return record;
                }
            });

            const sortedAssessments = processedAssessments.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            
            setAssessments(sortedAssessments);
            overwriteAssessmentHistory(sortedAssessments);
            if (sortedAssessments.length === 0) { 
                setError(null); 
            }
          } else {
            let userErrorMessage = t.errorOccurred + " (Datos de evaluación recibidos no son válidos o tienen un formato incorrecto)";
            if (validationResult.error.issues.length > 0) {
                const firstIssue = validationResult.error.issues[0];
                userErrorMessage += `. Detalle: ${firstIssue.message} en la ruta '${firstIssue.path.join('.')}'`;
            }
            setError(userErrorMessage);
          }
        } else { 
           setError(t.errorOccurred + " (No se pudieron procesar los datos de evaluaciones. Formato inesperado o fallo en desencriptación.)");
        }

      } else { 
        if (apiResult.message && apiResult.message.toLowerCase().includes("no hay evaluaciones")) {
            setAssessments([]); 
            overwriteAssessmentHistory([]);
            setError(null); 
        } else {
            setError(`${t.errorOccurred}: ${apiResult.message || 'Error desconocido del servidor'}`);
        }
      }
    } catch (e: any) {
      let errorMessage = t.errorOccurred;
      if (e.name === 'AbortError' || (e.cause && e.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
        errorMessage = t.errorOccurred + " (Tiempo de espera agotado)";
      } else if (e instanceof SyntaxError) { 
        errorMessage = t.errorOccurred + " (Respuesta del servidor no es JSON válido incluso después de intentar procesarla. Revisa la consola.)";
      } else if (e.message) {
        errorMessage = e.message; 
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (isClient && !userLoading && user && user.id) { 
      fetchAssessments();
    } else if (isClient && !userLoading && (!user || !user.id)) {
      setIsLoading(false);
      setError(t.errorOccurred + " (Debes iniciar sesión y tener un ID de usuario para ver tus evaluaciones)");
    }
  }, [isClient, user, userLoading, t, fetchAssessments]); 

  if (!isClient || isLoading || userLoading) {
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
              <Link href="/assessment">Continuar Evaluación</Link>
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

    

    