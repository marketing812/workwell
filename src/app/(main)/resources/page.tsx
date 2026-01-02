
"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { type ResourceCategory } from '@/data/resourcesData';
import { ArrowRight, BookOpen, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const t = useTranslations();
  const router = useRouter();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/resources');
      if (!res.ok) {
        throw new Error('No se pudieron cargar las categorías');
      }
      const data = await res.json();
      setCategories(data);
    } catch (e: any) {
      setError(e.message || "Error al cargar datos.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleRefresh = () => {
    // router.refresh() le dice a Next.js que vuelva a buscar los datos
    // para esta página en el servidor, invalidando la caché para esta visita.
    setLoading(true);
    router.refresh();
    // Volvemos a llamar a fetchData para actualizar el estado del componente
    // una vez que los nuevos datos estén disponibles tras el refresh.
    // Damos un pequeño margen para que el refresh del servidor se complete.
    setTimeout(() => {
       fetchData();
    }, 500);
  };


  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.resourcesTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.resourcesIntro}
        </p>
      </div>

       <div className="mb-8 text-center">
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refrescar Recursos
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && categories.length === 0 && (
         <div className="text-center text-muted-foreground">
          <p>No se encontraron categorías con artículos publicados en este momento.</p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: ResourceCategory) => (
            <Link key={category.id} href={`/resources/category/${category.slug}`} legacyBehavior>
              <a className="block group">
                <Card className="shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                  <CardHeader>
                    <BookOpen className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-2xl text-accent group-hover:text-primary transition-colors">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>Explora los {category.count} artículos y ejercicios sobre {category.name.toLowerCase()}.</CardDescription>
                  </CardContent>
                  <CardContent>
                     <div className="flex items-center text-sm text-primary font-semibold">
                      Ver categoría <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
