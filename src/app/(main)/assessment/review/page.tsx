
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { assessmentDimensions as assessmentDimensionsData } from '@/data/assessmentDimensions';


export default function AssessmentReviewPage() {
  const [assessmentDimensions, setAssessmentDimensions] = useState<AssessmentDimension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos la carga para mantener consistencia, aunque los datos ya estén aquí.
    setAssessmentDimensions(assessmentDimensionsData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Listado Completo de Preguntas de Evaluación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {assessmentDimensions.map((dimension) => (
              <div key={dimension.id}>
                <h3 className="text-lg font-semibold text-accent mt-4 mb-2">
                  {dimension.name}
                </h3>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {dimension.items.map((item) => (
                    <li key={item.id} className="text-sm">
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel Principal
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
