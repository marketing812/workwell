"use client";

import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from 'recharts';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { Activity } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmotionalProfileChartProps {
  results: {
    emotionalProfile: Record<string, number>;
  };
  rawAnswers?: Record<string, number | { score?: number; weight?: number }> | null;
  assessmentDimensions: AssessmentDimension[];
  className?: string;
}

function normalizeDimensionKey(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function splitLabelInTwoLines(value: string, maxCharsPerLine: number): [string, string?] {
  const words = String(value || '').split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const firstLineWords: string[] = [];
  let firstLineLength = 0;

  for (const word of words) {
    const nextLength = firstLineLength + (firstLineWords.length > 0 ? 1 : 0) + word.length;
    if (nextLength <= maxCharsPerLine || firstLineWords.length === 0) {
      firstLineWords.push(word);
      firstLineLength = nextLength;
    } else {
      break;
    }
  }

  const secondLineWords = words.slice(firstLineWords.length);
  const firstLine = firstLineWords.join(' ');
  const secondLine = secondLineWords.join(' ');

  return secondLine ? [firstLine, secondLine] : [firstLine];
}

export function EmotionalProfileChart({ results, rawAnswers, assessmentDimensions, className }: EmotionalProfileChartProps) {
  const t = useTranslations();
  const isMobile = useIsMobile();

  if (!results || !results.emotionalProfile || Object.keys(results.emotionalProfile).length === 0 || !assessmentDimensions || assessmentDimensions.length === 0) {
    return null;
  }

  const normalizedProfile = new Map<string, number>();
  Object.entries(results.emotionalProfile || {}).forEach(([key, value]) => {
    const numericValue = Number(value as unknown);
    if (Number.isFinite(numericValue)) {
      normalizedProfile.set(normalizeDimensionKey(key), numericValue);
    }
  });

  const overallScore = normalizedProfile.get(normalizeDimensionKey('Estado Emocional General'));

  const radarData = assessmentDimensions.map((dim) => {
    const exactScore = results.emotionalProfile[dim.name];
    const normalizedScore = normalizedProfile.get(normalizeDimensionKey(dim.name));

    let scoreValue: number | null =
      typeof exactScore === 'number' && Number.isFinite(exactScore)
        ? exactScore
        : (typeof normalizedScore === 'number' && Number.isFinite(normalizedScore) ? normalizedScore : null);

    if (scoreValue === null && rawAnswers && typeof rawAnswers === 'object') {
      let weightedTotal = 0;
      let weightsSum = 0;

      dim.items.forEach((item) => {
        const rawAnswerValue = (rawAnswers as Record<string, number | { score?: number; weight?: number }>)[item.id];
        const answer =
          typeof rawAnswerValue === 'object' && rawAnswerValue !== null
            ? Number(rawAnswerValue.score)
            : Number(rawAnswerValue);
        const answerWeight =
          typeof rawAnswerValue === 'object' && rawAnswerValue !== null
            ? Number(rawAnswerValue.weight ?? item.weight ?? 1)
            : Number(item.weight ?? 1);
        const weight = Number.isFinite(answerWeight) && answerWeight > 0 ? answerWeight : 1;

        if (Number.isFinite(answer) && Number.isFinite(weight) && weight > 0) {
          weightedTotal += answer * weight;
          weightsSum += weight;
        }
      });

      if (weightsSum > 0) {
        scoreValue = weightedTotal / weightsSum;
      }
    }

    if (scoreValue === null) {
      scoreValue = 0;
    }

    const finalScore = Math.max(0, Math.min(5, scoreValue));
    return {
      dimensionId: dim.id,
      dimension: dim.name,
      score: finalScore,
      fullMark: 5,
    };
  });

  const hasMeaningfulDimensionData = radarData.some((item) => item.score > 0);
  const finalRadarData =
    !hasMeaningfulDimensionData && typeof overallScore === 'number' && Number.isFinite(overallScore) && overallScore > 0
      ? radarData.map((item) => ({ ...item, score: Math.max(0, Math.min(5, overallScore)) }))
      : radarData;

  const chartConfig = {
    score: {
      label: t.emotionalProfile,
      color: 'hsl(var(--primary))',
    },
  };
  const getLabel = (value: string) => {
    const cleanValue = String(value || '').split('(')[0].trim();
    const maxLength = isMobile ? 12 : 28;
    return cleanValue.length > maxLength ? `${cleanValue.slice(0, maxLength)}…` : cleanValue;
  };

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-accent" />{t.myEmotionalProfile}</CardTitle>
        <CardDescription>{t.myEmotionalProfileDescription}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-hidden">
        <div className="h-[320px] sm:h-[360px] w-full min-w-0 overflow-hidden">
          <ChartContainer config={chartConfig} className="w-full h-full min-w-0 aspect-auto">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? '56%' : '64%'}
              data={finalRadarData}
              margin={isMobile ? { top: 24, right: 18, bottom: 26, left: 18 } : { top: 26, right: 30, bottom: 34, left: 30 }}
            >
              <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={({ x, y, payload, textAnchor }) => {
                  const label = getLabel(String((payload as { value?: string })?.value ?? ''));
                  const [line1, line2] = splitLabelInTwoLines(label, isMobile ? 12 : 16);
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={isMobile ? 3 : 0}
                      textAnchor={textAnchor ?? "middle"}
                      fill="hsl(var(--foreground))"
                      fontSize={isMobile ? 6.5 : 8}
                    >
                      <tspan x={x} dy={isMobile ? 0 : 4}>{line1}</tspan>
                      {line2 ? <tspan x={x} dy={isMobile ? 7 : 9}>{line2}</tspan> : null}
                    </text>
                  );
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tickCount={6}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Radar
                name={t.emotionalProfile}
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <ChartTooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '3 3' }}
                content={
                  <ChartTooltipContent
                    className="!bg-background !border !border-border !shadow-lg !rounded-md max-w-xs"
                    formatter={(value, name, itemProps) => (
                      <div className="text-sm p-1">
                        <div className="font-medium text-foreground">{itemProps.payload.dimension}</div>
                        <div className="text-muted-foreground">Puntuación: {Number(itemProps.payload.score).toFixed(1)}/5</div>
                      </div>
                    )}
                  />
                }
              />
            </RadarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
