import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { type ResourceCategory, getResourceCategories } from '@/data/resourcesData';
import { ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default async function ResourcesPage() {
  const t = useTranslations();
  const categories = await getResourceCategories();

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.resourcesTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.resourcesIntro}
        </p>
      </div>

      {!categories || categories.length === 0 ? (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No se pudieron cargar las categorías de recursos en este momento. Por favor, inténtalo más tarde.</AlertDescription>
        </Alert>
      ) : (
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
