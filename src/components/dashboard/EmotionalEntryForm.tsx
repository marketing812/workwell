
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface EmotionalEntryFormProps {
  onSubmit: (data: { situation: string; thought: string; emotion: string }) => void;
}

export const emotions = [
  { value: "tristeza", labelKey: "emotionSadness" },
  { value: "miedo", labelKey: "emotionFear" },
  { value: "ira", labelKey: "emotionAnger" },
  { value: "asco", labelKey: "emotionDisgust" },
  { value: "estres", labelKey: "emotionStress" },
  { value: "ansiedad", labelKey: "emotionAnxiety" },
  { value: "agobio", labelKey: "emotionOverwhelm" },
  { value: "tension", labelKey: "emotionTension" },
  { value: "alarma", labelKey: "emotionAlarm" },
  { value: "cansancio_emocional", labelKey: "emotionEmotionalTiredness" },
  { value: "desaliento", labelKey: "emotionDiscouragement" },
  { value: "vacio", labelKey: "emotionEmptiness" },
  { value: "frustracion", labelKey: "emotionFrustration" },
  { value: "rechazo", labelKey: "emotionRejection" },
  { value: "soledad", labelKey: "emotionLoneliness" },
  { value: "celos", labelKey: "emotionJealousy" },
  { value: "envidia", labelKey: "emotionEnvy" },
  { value: "verguenza", labelKey: "emotionShame" },
  { value: "culpa", labelKey: "emotionGuilt" },
  { value: "inseguridad", labelKey: "emotionInsecurity" },
  { value: "confusion", labelKey: "emotionConfusion" },
  { value: "ambivalencia", labelKey: "emotionAmbivalence" },
  { value: "alegria", labelKey: "emotionJoy" },
  { value: "sorpresa", labelKey: "emotionSurprise" },
  { value: "ilusion", labelKey: "emotionHope" },
  { value: "entusiasmo", labelKey: "emotionEnthusiasm" },
  { value: "esperanza", labelKey: "emotionHopefulness" },
  { value: "amor", labelKey: "emotionLove" },
  { value: "confianza", labelKey: "emotionTrust" },
  { value: "orgullo", labelKey: "emotionPride" },
];


export function EmotionalEntryForm({ onSubmit }: EmotionalEntryFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !thought.trim() || !selectedEmotion) {
      toast({
        title: t.errorOccurred,
        description: t.fillAllFields,
        variant: "destructive",
      });
      return;
    }
    onSubmit({ situation, thought, emotion: selectedEmotion });
    // Reset form fields after successful submission is handled by the parent
    setSituation("");
    setThought("");
    setSelectedEmotion("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="situation" className="text-base">
          {t.situationLabel}
        </Label>
        <Textarea
          id="situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder={t.situationPlaceholder}
          rows={3}
          className="text-sm"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="thought" className="text-base">
          {t.thoughtLabel}
        </Label>
        <Textarea
          id="thought"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder={t.thoughtPlaceholder}
          rows={3}
          className="text-sm"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="emotion" className="text-base">
          {t.emotionLabel}
        </Label>
        <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
          <SelectTrigger id="emotion" className="w-full text-sm">
            <SelectValue placeholder={t.emotionPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {emotions.map((emo) => (
              <SelectItem key={emo.value} value={emo.value} className="text-sm">
                {t[emo.labelKey as keyof typeof t] || emo.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full mt-2">
        {t.saveEntryButton}
      </Button>
    </form>
  );
}
