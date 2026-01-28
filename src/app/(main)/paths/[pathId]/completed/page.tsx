
'use client';

import { useUser } from '@/contexts/UserContext';
import { pathsData } from '@/data/pathsData';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function PathCompletedPage() {
  const { user } = useUser();
  const params = useParams();
  const { pathId } = params;

  const path = pathsData.find(p => p.id === pathId);

  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-2xl text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="pt-10">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
          <CardTitle className="text-4xl font-bold text-primary">
            ¡Ruta Completada!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-8 text-lg text-muted-foreground">
          <p>
            ¡Enhorabuena, <span className="font-semibold text-foreground">{user?.name || 'campeón/a'}</span>!
          </p>
          <p>
            Has completado todos los módulos de la ruta <span className="font-semibold text-accent">"{path?.title || 'seleccionada'}"</span>.
          </p>
          <p className="font-medium text-foreground">
            ¡Sigue así explorando tu bienestar!
          </p>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row items-center justify-center gap-4 pt-8 pb-10">
          <Button asChild size="lg">
            <Link href="/paths">
              <LayoutGrid className="mr-2 h-5 w-5" />
              Ir a todas las Rutas
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <Home className="mr-2 h-5 w-5" />
              Ir al Panel Principal
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
