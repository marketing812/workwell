"use client";

import Link from 'next/link';
import Image from 'next/image';
import { pathsData, type Path } from '@/data/pathsData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowRight, BookCheck, Lock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';
import { getCompletedModules } from '@/lib/progressStore';
import { getPathUnlockInfo } from '@/lib/pathAccess';

export default function PathsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [highlightedPathId, setHighlightedPathId] = useState<string | null>(null);
  const [, setProgressVersion] = useState(0);

  useEffect(() => {
    const startWithPath = searchParams.get('start_with');
    if (startWithPath) {
      const path = pathsData.find(p => p.title.toLowerCase() === startWithPath.toLowerCase() || p.id === startWithPath);
      if (path) {
        setHighlightedPathId(path.id);
        const element = document.getElementById(`path-${path.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const refreshProgress = () => setProgressVersion((prev) => prev + 1);
    const progressEvents = pathsData.map((path) => `progress-updated-${path.id}`);

    progressEvents.forEach((eventName) => {
      window.addEventListener(eventName, refreshProgress);
    });
    window.addEventListener('storage', refreshProgress);

    return () => {
      progressEvents.forEach((eventName) => {
        window.removeEventListener(eventName, refreshProgress);
      });
      window.removeEventListener('storage', refreshProgress);
    };
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.pathsTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.selectPathPrompt}</p>
         <Button asChild variant="outline" className="mt-6">
          <Link href="/paths/my-summary">
            <BookCheck className="mr-2 h-4 w-4" />
            {t.viewMyPathsSummaryButton}
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pathsData.map((path: Path) => {
          const unlockInfo = getPathUnlockInfo(path.id, pathsData, getCompletedModules);
          const isLocked = !unlockInfo.isUnlocked;

          return (
          <Card
            key={path.id}
            id={`path-${path.id}`}
            className={`shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col ${highlightedPathId === path.id ? 'ring-2 ring-primary scale-105' : ''} ${isLocked ? 'opacity-70' : ''}`}
          >
            <CardHeader>
              <div className="relative h-48 w-full mb-4 rounded-t-lg overflow-hidden">
                <Image 
                  src={`${EXTERNAL_SERVICES_BASE_URL}/imgapp/600x400/${encodeURIComponent(path.title.replace(':', ''))}_600x400.jpg`} 
                  alt={path.title} 
                  fill
                  className="object-cover"
                  data-ai-hint={path.dataAiHint || path.title}
                />
              </div>
              <CardTitle className="text-2xl text-accent">{path.title}</CardTitle>
              <CardDescription className="text-sm min-h-[40px]">{path.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLocked && (
                <p className="text-sm text-muted-foreground">
                  Desbloquea esta ruta completando antes: <span className="font-medium">{unlockInfo.previousPathTitle}</span>
                </p>
              )}
            </CardContent>
            <CardFooter>
              {isLocked ? (
                <Button className="w-full" disabled>
                  <Lock className="mr-2 h-4 w-4" />
                  Ruta bloqueada
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/paths/${path.id}`}>
                    Explorar Ruta <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
