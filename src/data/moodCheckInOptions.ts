
import { Smile, Frown, Meh, Annoyed, Laugh } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MoodOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  score: number;
}

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
