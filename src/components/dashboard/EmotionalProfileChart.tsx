
"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts"
import type { AssessmentDimension } from '@/data/paths/pathTypes'; 
import { Activity } from 'lucide-react';

interface EmotionalProfileChartProps {
  results: {
    emotionalProfile: Record<string, number>;
  };
  rawAnswers?: Record<string, number | { score?: number; weight?: number }> | null;
  assessmentDimensions: AssessmentDimension[]; 
  className?: string;
}

function normalizeDimensionKey(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function EmotionalProfileChart({ results, rawAnswers, assessmentDimensions, className }: EmotionalProfileChartProps) {
  const t = useTranslations();

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

  const overallScore = normalizedProfile.get(normalizeDimensionKey("Estado Emocional General"));

  const radarData = assessmentDimensions.map(dim => {
    const exactScore = results.emotionalProfile[dim.name];
    const normalizedScore = normalizedProfile.get(normalizeDimensionKey(dim.name));

    let scoreValue: number | null =
      typeof exactScore === "number" && Number.isFinite(exactScore) ?
        exactScore :
        (typeof normalizedScore === "number" && Number.isFinite(normalizedScore) ? normalizedScore : null);

    if (scoreValue === null && rawAnswers && typeof rawAnswers === "object") {
      let weightedTotal = 0;
      let weightsSum = 0;

      dim.items.forEach((item) => {
        const rawAnswerValue = (rawAnswers as Record<string, number | { score?: number; weight?: number }>)[item.id];
        const answer =
          typeof rawAnswerValue === "object" && rawAnswerValue !== null ?
            Number(rawAnswerValue.score) :
            Number(rawAnswerValue);
        const answerWeight =
          typeof rawAnswerValue === "object" && rawAnswerValue !== null ?
            Number(rawAnswerValue.weight ?? item.weight ?? 1) :
            Number(item.weight ?? 1);
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
    !hasMeaningfulDimensionData && typeof overallScore === "number" && Number.isFinite(overallScore) && overallScore > 0 ?
      radarData.map((item) => ({...item, score: Math.max(0, Math.min(5, overallScore))})) :
      radarData;

  const chartConfig = {
    score: {
      label: t.emotionalProfile,
      color: "hsl(var(--primary))", 
    },
  };

  return (
    <Card className={`shadow-lg ${className}`}>
        <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-accent" />{t.myEmotionalProfile}</CardTitle>
            <CardDescription>{t.myEmotionalProfileDescription}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={finalRadarData}>
                    <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                        dataKey="dimension"
                        tick={({ x, y, payload }) => (
                          <text x={x} y={y} dy={4} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={9}>
                            {payload.value.split('(')[0].trim().substring(0,12)}
                          </text>
                        )}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
                    <Radar 
                        name={t.emotionalProfile} 
                        dataKey="score" 
                        stroke="hsl(var(--primary))"  
                        fill="hsl(var(--primary))"  
                        fillOpacity={0.6} 
                    />
                    <ChartTooltip
                        cursor={{ stroke: "hsl(var(--border))", strokeDasharray: '3 3' }} 
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
