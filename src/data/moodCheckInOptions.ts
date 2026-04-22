
import { Smile, Frown, Meh, Annoyed, Laugh } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MoodOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  score: number;
}

export const moodCheckInToneClasses: Record<number, { base: string; selected: string }> = {
  1: {
    base: 'border-rose-200 bg-rose-50',
    selected: 'border-rose-300 bg-rose-100 ring-rose-200',
  },
  2: {
    base: 'border-orange-200 bg-orange-50',
    selected: 'border-orange-300 bg-orange-100 ring-orange-200',
  },
  3: {
    base: 'border-amber-200 bg-amber-50',
    selected: 'border-amber-300 bg-amber-100 ring-amber-200',
  },
  4: {
    base: 'border-lime-200 bg-lime-50',
    selected: 'border-lime-300 bg-lime-100 ring-lime-200',
  },
  5: {
    base: 'border-emerald-200 bg-emerald-50',
    selected: 'border-emerald-300 bg-emerald-100 ring-emerald-200',
  },
};

export const moodCheckInOptions: MoodOption[] = [
  {
    value: 'muy-mal',
    label: 'Muy mal',
    description: 'Me he sentido triste, agobiado/a, irritable o sin energía la mayor parte del día.',
    icon: Frown,
    score: 1,
  },
  {
    value: 'mal',
    label: 'Mal',
    description: 'El día ha sido emocionalmente pesado, con momentos puntuales de alivio.',
    icon: Annoyed,
    score: 2,
  },
  {
    value: 'neutral',
    label: 'Neutral / Regular',
    description: 'Un día normal, con altibajos, pero sin emociones muy intensas.',
    icon: Meh,
    score: 3,
  },
  {
    value: 'bien',
    label: 'Bien',
    description: 'En general he tenido un buen día, con sensaciones agradables predominantes.',
    icon: Smile,
    score: 4,
  },
  {
    value: 'muy-bien',
    label: 'Muy bien',
    description: 'Me he sentido animado/a, tranquilo/a, con energía y emocionalmente en equilibrio.',
    icon: Laugh,
    score: 5,
  },
];
