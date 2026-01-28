
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SupportBankExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SupportBankExerciseProps {
  content: SupportBankExerciseContent;
  pathId: string;
}

interface Person {
    name: string;
    supportType: string;
    confidence: number;
}

const supportOptions = [
    'Escuchar y aconsejar',
    'Acompañar físicamente',
    'Ayudar con tareas concretas',
    'Apoyo económico o material',
    'Otro'
];

export function SupportBankExercise({ content, pathId }: SupportBankExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState<Person[]>(Array(5).fill({ name: '', supportType: '', confidence: 3 }));
  const [isSaved, setIsSaved] = useState(false);

  const handlePersonChange = <K extends keyof Person>(index: number, field: K, value: Person[K]) => {
    const newPeople = [...people];
    newPeople[index] = { ...newPeople[index], [field]: value };
    setPeople(newPeople);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledPeople = people.filter(p => p.name.trim() !== '');
    if (filledPeople.length === 0) {
      toast({ title: 'Mapa vacío', description: 'Añade al menos una persona para guardar tu mapa.', variant: 'destructive' });
      return;
    }
    
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    filledPeople.forEach(p => {
        notebookContent += `**Persona:** ${p.name}\n- Tipo de apoyo: ${p.supportType || 'No especificado'}\n- Grado de confianza: ${p.confidence}/5\n\n`;
    });
    addNotebookEntry({ title: 'Mi Banco de Apoyos', content: notebookContent, pathId: pathId });
    toast({ title: 'Banco de Apoyos Guardado' });
    setIsSaved(true);
    setStep(prev => prev + 1);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setPeople(Array(5).fill({ name: '', supportType: '', confidence: 3 }));
    setIsSaved(false);
  }

  const renderStep = () => {
    const filledPeople = people.filter(p => p.name.trim() !== '');

    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Tu red de apoyo es como un banco: a veces necesitas hacer un depósito y otras, una retirada. Pero para poder usarlo, primero necesitas saber qué tienes en tu cuenta.</p>
            <Button onClick={nextStep}>Comenzar mi inventario <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Paso 1: Lista inicial
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Lista de personas conocidas</h4>
            <p className="text-sm text-muted-foreground">Piensa en tu familia, amistades, compañeros/as de trabajo, vecinos/as… Cualquiera que conozcas y con quien tengas algo de confianza.</p>
            <div className="space-y-3">
              {people.map((p, i) => (
                <Input key={i} value={p.name} onChange={e => handlePersonChange(i, 'name', e.target.value)} placeholder={`Persona ${i + 1}...`} />
              ))}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={filledPeople.length === 0}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Paso 2: Clasificar por tipo de apoyo
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Clasifica por tipo de apoyo</h4>
            <p className="text-sm text-muted-foreground">Para cada persona, elige qué tipo de ayuda podría darte.</p>
            {filledPeople.map((p, i) => (
              <div key={i} className="p-3 border rounded-md bg-background">
                <Label htmlFor={`support-type-${i}`} className="font-semibold">{p.name}</Label>
                <Select value={p.supportType} onValueChange={v => handlePersonChange(i, 'supportType', v)}>
                  <SelectTrigger id={`support-type-${i}`} className="mt-2"><SelectValue placeholder="Elige un tipo de apoyo..." /></SelectTrigger>
                  <SelectContent>
                    {supportOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Paso 3: Valorar la confianza
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
             <h4 className="font-semibold text-lg">Paso 3: Valora la confianza y disponibilidad</h4>
             <p className="text-sm text-muted-foreground">Del 1 al 5, ¿qué tan probable es que acudas a esta persona?</p>
             {filledPeople.map((p, i) => (
                <div key={i} className="p-3 border rounded-md bg-background">
                    <Label htmlFor={`confidence-${i}`} className="font-semibold flex justify-between">
                        <span>{p.name}</span>
                        <span className="flex items-center gap-1">{p.confidence} <Star className="h-4 w-4 text-amber-400 fill-amber-400"/></span>
                    </Label>
                    <Slider id={`confidence-${i}`} value={[p.confidence]} onValueChange={v => handlePersonChange(i, 'confidence', v[0])} min={1} max={5} step={1} className="mt-2"/>
                </div>
             ))}
              <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Ver mi mapa final <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4: // Paso 4: Mapa de apoyos y guardado
        return (
            <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                 <h4 className="font-semibold text-lg text-center">Paso 4: Tu mapa de apoyos final</h4>
                 <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Persona</TableHead>
                                <TableHead>Tipo de apoyo</TableHead>
                                <TableHead className="text-right">Confianza</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filledPeople.map((p, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>{p.supportType || "No clasificado"}</TableCell>
                                    <TableCell className="text-right flex justify-end items-center gap-1">{p.confidence} <Star className="h-4 w-4 text-amber-400 fill-amber-400"/></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button type="submit" disabled={isSaved}><Save className="mr-2 h-4 w-4"/>Guardar Mapa</Button>
                </div>
            </form>
        );
      case 5: // Confirmation
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Mapa de Apoyos Guardado</h4>
                <p className="text-muted-foreground">Ya tienes tu mapa personal. Puedes volver a consultarlo en tu cuaderno cuando lo necesites.</p>
                <Button onClick={resetExercise} variant="outline">Hacer otro mapa</Button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && (
          <CardDescription className="pt-2">
            <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana3tecnica2.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
            {content.objective}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
