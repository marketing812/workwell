
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

export function QuestionnaireForm({ onSubmit, isSubmitting, assessmentDimensions, isGuided = false }: QuestionnaireFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  
  const allItems = assessmentDimensions.flatMap(dim => dim.items);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, { score: number; weight: number }>>({});
  const [showDimensionCompletedDialog, setShowDimensionCompletedDialog] = useState(false); // This might be removed for guided version

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(IN_PROGRESS_ANSWERS_KEY);
      if (savedProgress) {
        const parsedData = JSON.parse(savedProgress) as InProgressData;
        if (parsedData.answers) {
            setAnswers(parsedData.answers);
            if(isGuided){
                const answeredIds = Object.keys(parsedData.answers);
                const lastAnsweredItemIndex = allItems.findIndex(item => item.id === answeredIds[answeredIds.length - 1]);
                if (lastAnsweredItemIndex !== -1 && lastAnsweredItemIndex < allItems.length - 1) {
                    setCurrentIndex(lastAnsweredItemIndex + 1);
                }
            }
            toast({
              title: "Evaluación Reanudada",
              description: "Hemos cargado tu progreso anterior.",
            });
        }
      }
    } catch (error) {
      console.error("Error loading in-progress assessment:", error);
    }
  }, [toast, isGuided, allItems]);
  
  const saveProgress = (index: number, currentAnswers: Record<string, { score: number; weight: number }>) => {
    try {
      const dataToSave = {
        answers: currentAnswers,
        position: index, // Simplified for guided version
      };
      localStorage.setItem(IN_PROGRESS_ANSWERS_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving partial progress:", error);
    }
  };

  const currentItem = allItems[currentIndex];
  const progressPercentage = (currentIndex / allItems.length) * 100;

  const handleAnswerChange = (item: AssessmentItem, value: string) => {
    const newAnswers = {
      ...answers,
      [item.id]: { score: parseInt(value), weight: item.weight }
    };
    setAnswers(newAnswers);
    
    setTimeout(() => {
        if (currentIndex < allItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitFullAssessment(newAnswers);
        }
    }, 250); // Short delay before sliding
  };
  
  const handleGoBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
  
  if (!currentItem) {
    if (allItems.length > 0 && currentIndex >= allItems.length) {
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

  const isFirstQuestion = currentIndex === 0;

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
        <CardHeader>
          <Progress value={progressPercentage} className="w-full mb-4" aria-label={`Progreso: ${progressPercentage.toFixed(0)}%`} />
          <CardTitle className="text-lg font-semibold text-center text-primary">
            Evaluación Guiada
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-2 sm:px-6">
            <div 
              key={currentItem.id} 
              className={cn("py-4", "animate-in fade-in-0 slide-in-from-right-5 duration-500")}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                Pregunta {currentIndex + 1} de {allItems.length}
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
                      {IconComponent ? <IconComponent className="h-8 w-8 sm:h-10 sm:h-10 text-foreground/80" /> : option.label}
                      <span className="text-xs mt-1">{option.value}</span>
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
          <p className="text-sm text-muted-foreground">{currentIndex + 1} / {allItems.length}</p>
        </CardFooter>
      </Card>
    </>
  );
}
