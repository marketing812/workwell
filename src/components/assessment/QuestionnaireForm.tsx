
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import type { AssessmentItem, AssessmentDimension } from '@/data/paths/pathTypes';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { Loader2, ArrowRight, CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Helper para asegurar que los iconos se cargan correctamente
const FrownIcon = require('lucide-react').Frown;
const AnnoyedIcon = require('lucide-react').Annoyed;
const MehIcon = require('lucide-react').Meh;
const SmileIcon = require('lucide-react').Smile;
const LaughIcon = require('lucide-react').Laugh;

const iconMap: Record<string, React.ElementType> = {
  Frown: FrownIcon,
  Annoyed: AnnoyedIcon,
  Meh: MehIcon,
  Smile: SmileIcon,
  Laugh: LaughIcon,
};

const likertOptions = [
    { value: 1, label: 'Frown', description: 'Nada de acuerdo' },
    { value: 2, label: 'Annoyed', description: 'En desacuerdo' },
    { value: 3, label: 'Meh', description: 'Neutral' },
    { value: 4, label: 'Smile', description: 'De acuerdo' },
    { value: 5, label: 'Laugh', description: 'Totalmente de acuerdo' },
];

const IN_PROGRESS_ANSWERS_KEY = 'workwell-assessment-in-progress';

interface InProgressData {
  answers: Record<string, { score: number; weight: number }>;
  position: {
    dimension: number;
    item: number;
  };
}

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, { score: number; weight: number }>) => Promise<void>;
  isSubmitting: boolean;
  assessmentDimensions: AssessmentDimension[];
  isGuided?: boolean;
}

export function QuestionnaireForm({ onSubmit, isSubmitting, assessmentDimensions, isGuided = true }: QuestionnaireFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentItemIndexInDimension, setCurrentItemIndexInDimension] = useState(0);

  const [answers, setAnswers] = useState<Record<string, { score: number; weight: number }>>({});
  const [showDimensionCompletedDialog, setShowDimensionCompletedDialog] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);


  useEffect(() => {
    if (!Array.isArray(assessmentDimensions) || assessmentDimensions.length === 0 || hasLoadedProgress) return;

    try {
      const savedProgress = localStorage.getItem(IN_PROGRESS_ANSWERS_KEY);
      if (savedProgress) {
        const parsedData = JSON.parse(savedProgress) as InProgressData;
        if (parsedData.answers && parsedData.position) {
          setAnswers(parsedData.answers);
          const { dimension, item } = parsedData.position;

          const isLastDimension = dimension >= assessmentDimensions.length - 1;
          const isLastItem = isLastDimension && item >= assessmentDimensions[assessmentDimensions.length - 1].items.length - 1;

          if (!isLastItem) {
            setCurrentDimensionIndex(dimension);
            setCurrentItemIndexInDimension(item);
          } else {
            setCurrentDimensionIndex(assessmentDimensions.length - 1);
            setCurrentItemIndexInDimension(assessmentDimensions[assessmentDimensions.length - 1].items.length - 1);
          }
          setHasLoadedProgress(true);
          toast({
            title: "Evaluación Reanudada",
            description: "Hemos cargado tu progreso anterior.",
          });
        }
      } else {
        setHasLoadedProgress(true);
      }
    } catch (error) {
      console.error("Error loading in-progress assessment:", error);
      setHasLoadedProgress(true);
    }
  }, [toast, assessmentDimensions, hasLoadedProgress]);
  
  const saveProgress = (dimIndex: number, itemIndex: number, currentAnswers: Record<string, { score: number; weight: number }>) => {
    if (!isGuided) return;
    try {
      const dataToSave: InProgressData = {
        answers: currentAnswers,
        position: { dimension: dimIndex, item: itemIndex }
      };
      localStorage.setItem(IN_PROGRESS_ANSWERS_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving partial progress:", error);
    }
  };

  const allItems = Array.isArray(assessmentDimensions) && assessmentDimensions.length > 0
    ? assessmentDimensions.flatMap(dim => dim.items)
    : [];
  
  const currentDimension = Array.isArray(assessmentDimensions) ? assessmentDimensions[currentDimensionIndex] : undefined;
  const currentOverallIndex = Array.isArray(assessmentDimensions) ? assessmentDimensions.slice(0, currentDimensionIndex).reduce((acc, dim) => acc + dim.items.length, 0) + currentItemIndexInDimension : 0;
  const currentItem = currentDimension?.items[currentItemIndexInDimension];
  const progressPercentage = allItems.length > 0 ? (currentOverallIndex / allItems.length) * 100 : 0;


  const handleAnswerChange = (item: AssessmentItem, value: string) => {
    const newAnswers = {
      ...answers,
      [item.id]: { score: parseInt(value), weight: item.weight }
    };
    setAnswers(newAnswers);
    
    if (isGuided) {
      setTimeout(() => {
        if (!currentDimension) return; // Guard clause
        const isLastItemInDimension = currentItemIndexInDimension === currentDimension.items.length - 1;
        if (isLastItemInDimension) {
            if (!isSubmitting) { 
                setShowDimensionCompletedDialog(true);
            }
        } else {
            const nextItemIndex = currentItemIndexInDimension + 1;
            setCurrentItemIndexInDimension(nextItemIndex);
            saveProgress(currentDimensionIndex, nextItemIndex, newAnswers);
        }
      }, 250); 
    }
  };
  
  const handleGoBack = () => {
    if (currentItemIndexInDimension > 0) {
      setCurrentItemIndexInDimension(prev => prev - 1);
    } else if (currentDimensionIndex > 0) {
      const prevDimIndex = currentDimensionIndex - 1;
      const prevDim = assessmentDimensions[prevDimIndex];
      setCurrentDimensionIndex(prevDimIndex);
      setCurrentItemIndexInDimension(prevDim.items.length - 1);
    }
  };

  const submitFullAssessment = async (finalAnswers: Record<string, { score: number; weight: number }>) => {
    const allAnswered = allItems.every(item => finalAnswers.hasOwnProperty(item.id));
    if (!allAnswered) {
       toast({
         title: "Cuestionario Incompleto",
         description: "Por favor, responde a todas las preguntas antes de finalizar.",
         variant: "destructive"
       });
       return;
    }
    localStorage.removeItem(IN_PROGRESS_ANSWERS_KEY);
    await onSubmit(finalAnswers);
  };
  
  const handleDialogContinue = () => {
    setShowDimensionCompletedDialog(false);
    const isLastDimension = currentDimensionIndex === assessmentDimensions.length - 1;
    if (!isLastDimension) {
      const nextDimIndex = currentDimensionIndex + 1;
      setCurrentDimensionIndex(nextDimIndex);
      setCurrentItemIndexInDimension(0);
      saveProgress(nextDimIndex, 0, answers);
    } else {
      submitFullAssessment(answers);
    }
  };

  const handleNextStep = () => {
    if (!currentItem || !answers[currentItem.id] || !currentDimension) return; // Prevent advancing if no answer is selected
    const isLastItemInDimension = currentItemIndexInDimension === currentDimension.items.length - 1;
    if (isLastItemInDimension) {
      if (!isSubmitting) { 
        setShowDimensionCompletedDialog(true);
      }
    } else {
      const nextItemIndex = currentItemIndexInDimension + 1;
      setCurrentItemIndexInDimension(nextItemIndex);
      saveProgress(currentDimensionIndex, nextItemIndex, answers);
    }
  };

  const handleSaveForLater = () => {
    if(!currentDimension) return;
    const isLastDimension = currentDimensionIndex === assessmentDimensions.length - 1;
    let dimToSave = currentDimensionIndex;
    let itemToSave = currentItemIndexInDimension;
    if (currentItemIndexInDimension === currentDimension.items.length - 1 && !isLastDimension) {
      dimToSave = currentDimensionIndex + 1;
      itemToSave = 0;
    }
    saveProgress(dimToSave, itemToSave, answers);
    toast({ title: "Progreso Guardado", description: "Puedes continuar tu evaluación más tarde desde 'Mis Evaluaciones'." });
    setShowDimensionCompletedDialog(false);
    router.push('/my-assessments');
  };

  if (!currentItem) {
    if (allItems.length > 0 && currentOverallIndex >= allItems.length) {
       return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl text-center p-8">
            <CardHeader>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>¡Evaluación Completada!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Has respondido a todas las preguntas. Estamos procesando tus resultados.</p>
                <Button className="mt-4" onClick={() => submitFullAssessment(answers)} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Ver mis resultados
                </Button>
            </CardContent>
        </Card>
       )
    }
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const isFirstQuestion = currentDimensionIndex === 0 && currentItemIndexInDimension === 0;
  const isNextButtonActive = answers[currentItem.id] !== undefined;

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
        <CardHeader>
          <Progress value={progressPercentage} className="w-full mb-4" aria-label={`Progreso: ${progressPercentage.toFixed(0)}%`} />
          <CardTitle className="text-lg font-semibold text-center text-primary">
            {t.assessmentTitle}
          </CardTitle>
          {isGuided && (
            <CardDescription className="text-sm text-muted-foreground mt-2 text-center px-2">
                {currentDimension.name}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-2 px-2 sm:px-6">
            <div 
              key={currentItem.id} 
              className={cn("py-4", "animate-in fade-in-0 slide-in-from-right-5 duration-500")}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                Pregunta {currentOverallIndex + 1} de {allItems.length}
              </p>
              <p className="text-md sm:text-lg font-semibold text-primary mb-6 min-h-[3em] text-center px-2">{currentItem.text}</p>
              <RadioGroup
                value={answers[currentItem.id]?.score.toString() || ""}
                onValueChange={(value) => handleAnswerChange(currentItem, value)}
                className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 pt-2"
                aria-label={currentItem.text}
              >
                {likertOptions.map(option => {
                  const IconComponent = iconMap[option.label];
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`${currentItem.id}-${option.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105",
                        "w-16 h-16 sm:w-20 sm:h-20", 
                        answers[currentItem.id]?.score === option.value
                          ? "bg-primary/20 border-primary ring-2 ring-primary shadow-lg"
                          : "bg-background border-input"
                      )}
                      title={option.description}
                    >
                      <RadioGroupItem
                        value={option.value.toString()}
                        id={`${currentItem.id}-${option.value}`}
                        className="sr-only"
                      />
                      {IconComponent ? <IconComponent className="h-8 w-8 sm:h-10 sm:h-10 text-foreground/80" /> : null}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          </CardContent>
        <CardFooter className="flex justify-between items-center mt-4 p-4 border-t">
          <Button variant="outline" onClick={handleGoBack} disabled={isFirstQuestion}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <Button onClick={handleNextStep} disabled={!isNextButtonActive} variant={isNextButtonActive ? "secondary" : "secondary"}>
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showDimensionCompletedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary flex items-center gap-2 justify-center">
                <CheckCircle className="h-7 w-7" /> {t.dimensionCompletedTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base py-2 text-center">
              {t.dimensionCompletedMessage
                  .replace("{dimensionNumber}", (currentDimensionIndex + 1).toString())
                  .replace("{totalDimensions}", assessmentDimensions.length.toString())}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-col sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleSaveForLater} disabled={isSubmitting} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> {t.saveForLaterButton}
            </Button>
            <Button onClick={handleDialogContinue} disabled={isSubmitting} className="w-full sm:w-auto" autoFocus>
              {currentDimensionIndex === assessmentDimensions.length - 1 ? (isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.finishAssessment) : t.continueButton} 
              {currentDimensionIndex < assessmentDimensions.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              {currentDimensionIndex === assessmentDimensions.length - 1 && !isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
