
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MapaEmocionNecesidadCuidadoExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import { useUser } from '@/contexts/UserContext';

interface MapaEmocionNecesidadCuidadoExerciseProps {
  content: MapaEmocionNecesidadCuidadoExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const needOptions = [
    { id: 'respeto', label: 'Respeto' }, { id: 'seguridad', label: 'Seguridad' }, { id: 'claridad', label: 'Claridad' }, { id: 'descanso', label: 'Descanso' },
    { id: 'apoyo', label: 'Apoyo' }, { id: 'tiempo', label: 'Tiempo' }, { id: 'conexion', label: 'Conexión' }, { id: 'autonomia', label: 'Autonomía' },
    { id: 'validacion', label: 'Validación' }, { id: 'aceptacion', label: 'Aceptación' }, { id: 'acompañamiento', label: 'Acompañamiento' }, { id: 'sentido', label: 'Sentido' },
    { id: 'comprension', label: 'Comprensión' }, { id: 'libertad', label: 'Libertad' }, { id: 'tranquilidad', label: 'Tranquilidad' }, { id: 'confianza', label: 'Confianza' },
    { id: 'expresion', label: 'Expresión' }, { id: 'amor', label: 'Amor' }, { id: 'espacio', label: 'Espacio' }, { id: 'reconocimiento', label: 'Reconocimiento' }
];

const careActionsData = {
    laboral: [
        { id: 'pausa', label: 'Pedir una pausa o descanso breve' },
        { id: 'limite', label: 'Poner un límite con respeto' },
        { id: 'delegar', label: 'Delegar una tarea concreta' },
        { id: 'agradecer', label: 'Agradecerte lo que ya hiciste hoy' }
    ],
    familiar: [
        { id: 'compartir', label: 'Compartir cómo te sientes con alguien cercano' },
        { id: 'hablar', label: 'Hablar con alguien de confianza' },
        { id: 'pedir_ayuda', label: 'Pedir ayuda en una tarea doméstica' },
        { id: 'limite_cariño', label: 'Poner un límite con respeto y cariño' }
    ],
    personal: [
        { id: 'escribir', label: 'Escribir tus emociones en tu cuaderno' },
        { id: 'pausa_real', label: 'Darte 15 minutos de pausa real' },
        { id: 'nutrir', label: 'Hacer algo que te nutra (música, paseo, respiración)' },
        { id: 'no_exigir', label: 'No exigirte tanto hoy' },
        { id: 'llorar_respirar', label: 'Llorar, respirar, validar' }
    ]
};

export default function MapaEmocionNecesidadCuidadoExercise({ content, pathId, onComplete }: MapaEmocionNecesidadCuidadoExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [emotion, setEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [needs, setNeeds] = useState<Record<string, boolean>>({});
  const [otherNeed, setOtherNeed] = useState('');
  const [careActions, setCareActions] = useState({ laboral: '', familiar: '', personal: '' });
  const [otherCareActions, setOtherCareActions] = useState({ laboral: '', familiar: '', personal: '' });
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const storageKey = `exercise-progress-${pathId}-${content.type}`;

  // Cargar estado guardado al iniciar
  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setStep(data.step || 0);
        setEmotion(data.emotion || '');
        setOtherEmotion(data.otherEmotion || '');
        setNeeds(data.needs || {});
        setOtherNeed(data.otherNeed || '');
        setCareActions(data.careActions || { laboral: '', familiar: '', personal: '' });
        setOtherCareActions(data.otherCareActions || { laboral: '', familiar: '', personal: '' });
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  // Guardar estado en cada cambio
  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, emotion, otherEmotion, needs, otherNeed, careActions, otherCareActions };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, emotion, otherEmotion, needs, otherNeed, careActions, otherCareActions, storageKey, isClient]);


  const handleSave = () => {
    const selectedNeeds = needOptions.filter(n => needs[n.id]).map(n => n.label);
    if(needs['otra'] && otherNeed) selectedNeeds.push(otherNeed);

    const finalLaboral = careActions.laboral === 'Otra' ? otherCareActions.laboral : careActions.laboral;
    const finalFamiliar = careActions.familiar === 'Otra' ? otherCareActions.familiar : careActions.familiar;
    const finalPersonal = careActions.personal === 'Otra' ? otherCareActions.personal : careActions.personal;
    
    const allCareActions = [finalLaboral, finalFamiliar, finalPersonal].filter(Boolean);

    if (allCareActions.length === 0) {
      toast({ title: "Acción de cuidado requerida", description: "Por favor, selecciona al menos una acción.", variant: "destructive" });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Emoción sentida:* ${emotion === 'otra' ? otherEmotion : (emotionOptions.find(e => e.value === emotion)?.labelKey ? t[emotionOptions.find(e => e.value === emotion)!.labelKey as keyof typeof t] : emotion)}
*Necesidades detectadas:* ${selectedNeeds.join(', ')}
*Acciones de cuidado elegidas:*
${allCareActions.map(action => `- ${action}`).join('\n')}
    `;

    addNotebookEntry({ title: 'Mi Mapa Emoción-Necesidad-Cuidado', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Registro Guardado' });
    setIsSaved(true);
    onComplete();
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (!isClient) {
    return null; // O un componente de carga
  }

  const renderStep = () => {
    switch(step) {
      case 0: return <div className="p-4 space-y-4">
        <h4 className="font-semibold text-lg">Paso 1: Elige la emoción que sientes con más intensidad</h4>
        <p className="text-sm text-muted-foreground">¿Te cuesta reconocer lo que sientes? Te puedo ayudar distinguir entre: Emociones primarias: reacciones inmediatas ante algo (por ejemplo, miedo ante un peligro). Emociones secundarias: surgen tras interpretar o juzgar lo que sientes (por ejemplo, sentir culpa por haber sentido ira). Ambas son válidas. Este ejercicio te ayuda a reconocerlas sin filtros, para que puedas escucharte desde un lugar más honesto y compasivo. </p>
        <Select value={emotion} onValueChange={setEmotion}>
            <SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
            <SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}<SelectItem value="otra">Otra...</SelectItem></SelectContent>
        </Select>
        {emotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} /> }
        <Button onClick={nextStep} className="w-full mt-2" disabled={!emotion}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>;
      case 1: return <div className="p-4 space-y-4">
        <h4 className="font-semibold text-lg">Paso 2: ¿Qué podrías estar necesitando?</h4>
        <p className="text-sm text-muted-foreground">¿Qué valor tuyo se está viendo afectado o qué parte de ti necesita atención?</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {needOptions.map(n => <div key={n.id} className="flex items-center gap-2"><Checkbox id={n.id} checked={needs[n.id] || false} onCheckedChange={c => setNeeds(p => ({...p, [n.id]: !!c}))} /><Label htmlFor={n.id} className="font-normal">{n.label}</Label></div>)}
        </div>
        <div className="flex items-center gap-2 pt-2"><Checkbox id="otra" checked={needs['otra'] || false} onCheckedChange={c => setNeeds(p => ({...p, otra: !!c}))} /><Label htmlFor="otra" className="font-normal">Otra:</Label></div>
        {needs.otra && <Textarea value={otherNeed} onChange={e => setOtherNeed(e.target.value)} />}
        <div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
        </div>;
      case 2:
        const hasAnyAction = careActions.laboral || careActions.familiar || careActions.personal || otherCareActions.laboral || otherCareActions.familiar || otherCareActions.personal;
        return (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 3: ¿Qué podrías hacer hoy para cuidar esa necesidad?</h4>
                <p className="text-sm text-muted-foreground">Selecciona una o más acciones pequeñas, realistas y amables que puedas hacer hoy para cuidar eso que necesitas. No hace falta que sea perfecta, solo que sea realista:</p>
                
                <div className="space-y-3 mt-4">
                    <Label className="font-medium">Contexto laboral:</Label>
                    <RadioGroup value={careActions.laboral} onValueChange={(value) => setCareActions(p => ({...p, laboral: value}))}>
                        {careActionsData.laboral.map(a => (
                            <div key={`laboral-${a.id}`} className="flex items-center gap-2 pl-2">
                                <RadioGroupItem value={a.label} id={`laboral-${a.id}`}/>
                                <Label htmlFor={`laboral-${a.id}`} className="font-normal">{a.label}</Label>
                            </div>
                        ))}
                         <div className="flex items-center gap-2 pl-2">
                            <RadioGroupItem value="Otra" id="laboral-care-other"/>
                            <Label htmlFor="laboral-care-other" className="font-medium">Otra:</Label>
                        </div>
                    </RadioGroup>
                    {careActions.laboral === 'Otra' && (
                        <Textarea 
                            value={otherCareActions.laboral} 
                            onChange={e => setOtherCareActions(p => ({...p, laboral: e.target.value}))}
                            placeholder="Describe tu acción de cuidado personalizada..." 
                            className="ml-8"
                        />
                    )}
                </div>

                <div className="space-y-3 mt-4">
                    <Label className="font-medium">Contexto familiar:</Label>
                     <RadioGroup value={careActions.familiar} onValueChange={(value) => setCareActions(p => ({...p, familiar: value}))}>
                        {careActionsData.familiar.map(a => (
                            <div key={`familiar-${a.id}`} className="flex items-center gap-2 pl-2">
                                <RadioGroupItem value={a.label} id={`familiar-${a.id}`}/>
                                <Label htmlFor={`familiar-${a.id}`} className="font-normal">{a.label}</Label>
                            </div>
                        ))}
                         <div className="flex items-center gap-2 pl-2">
                            <RadioGroupItem value="Otra" id="familiar-care-other"/>
                            <Label htmlFor="familiar-care-other" className="font-medium">Otra:</Label>
                        </div>
                    </RadioGroup>
                     {careActions.familiar === 'Otra' && (
                        <Textarea 
                            value={otherCareActions.familiar} 
                            onChange={e => setOtherCareActions(p => ({...p, familiar: e.target.value}))}
                            placeholder="Describe tu acción de cuidado personalizada..." 
                            className="ml-8"
                        />
                    )}
                </div>

                <div className="space-y-3 mt-4">
                    <Label className="font-medium">Contexto personal:</Label>
                    <RadioGroup value={careActions.personal} onValueChange={(value) => setCareActions(p => ({...p, personal: value}))}>
                        {careActionsData.personal.map(a => (
                            <div key={`personal-${a.id}`} className="flex items-center gap-2 pl-2">
                                <RadioGroupItem value={a.label} id={`personal-${a.id}`}/>
                                <Label htmlFor={`personal-${a.id}`} className="font-normal">{a.label}</Label>
                            </div>
                        ))}
                         <div className="flex items-center gap-2 pl-2">
                            <RadioGroupItem value="Otra" id="personal-care-other"/>
                            <Label htmlFor="personal-care-other" className="font-medium">Otra:</Label>
                        </div>
                    </RadioGroup>
                     {careActions.personal === 'Otra' && (
                        <Textarea 
                            value={otherCareActions.personal} 
                            onChange={e => setOtherCareActions(p => ({...p, personal: e.target.value}))}
                            placeholder="Describe tu acción de cuidado personalizada..." 
                            className="ml-8"
                        />
                    )}
                </div>
                
                <div className="flex justify-between w-full mt-2">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                    <Button onClick={nextStep} className="w-auto" disabled={!hasAnyAction}>Ver Síntesis <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        );
      case 3: 
        const finalLaboral = careActions.laboral === 'Otra' ? otherCareActions.laboral : careActions.laboral;
        const finalFamiliar = careActions.familiar === 'Otra' ? otherCareActions.familiar : careActions.familiar;
        const finalPersonal = careActions.personal === 'Otra' ? otherCareActions.personal : careActions.personal;
        const allCareActions = [finalLaboral, finalFamiliar, finalPersonal].filter(Boolean);

        return <div className="p-4 space-y-4 text-center">
            <p>Hoy sentí: <strong>{emotion==='otra' ? otherEmotion : emotion}</strong>. Porque estoy necesitando: <strong>{needOptions.filter(n=>needs[n.id]).map(n=>n.label).join(', ')}</strong>.</p>
            <p className="font-semibold">Me propongo cuidarme así:</p>
            <ul className="list-disc list-inside text-left mx-auto max-w-md">
                {allCareActions.map((action, i) => <li key={i}>{action}</li>)}
            </ul>
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar en el cuaderno terapéutico</Button>
            <Button onClick={prevStep} variant="outline" className="w-full mt-2"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
        </div>;
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{"Quiero ayudarte a hacer algo que muchas personas no saben cómo empezar: traducir una emoción en una necesidad, y luego, transformar esa necesidad en una acción real que te cuide. Este ejercicio es como encender una luz dentro de ti: vas a observar lo que te duele, y en lugar de taparlo, vas a preguntarte qué necesita atención. Así empieza la transformación. Duración estimada: 5-10 minutos. Te recomiendo hacerlo 3 o 4 veces esta semana. "}
        <div className="mt-4"><audio controls controlsList="nodownload" className="w-full"><source src="https://workwellfut.com/audios/ruta6/tecnicas/Ruta6semana2tecnica1.mp3" type="audio/mp3" />Tu navegador no soporta el elemento de audio.</audio></div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        {isSaved ? (
          <div className="p-4 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Guardado!</h4>
            <p className="text-muted-foreground">Tu mapa ha sido guardado en el cuaderno. Puedes revisarlo cuando quieras.</p>
            <Button onClick={() => {
              setIsSaved(false);
              setStep(0);
            }} variant="outline">Hacer otro registro</Button>
          </div>
        ) : renderStep()}
      </CardContent>
    </Card>
  );
}

    