
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { getPostsByCategory, getCategoryBySlug, type ResourcePost, type ResourceCategory } from '@/data/resourcesData';
import { notFound } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Metadata } from 'next';
import type { RoutePageProps } from '@/types/page-props';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: RoutePageProps<{ slug: string }>) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const category: ResourceCategory | null = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts: ResourcePost[] = await getPostsByCategory(slug);
  
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4 capitalize">{category.name}</h1>
      </div>

       <div className="mb-8 text-center">
        <Button asChild variant="outline">
          <Link href="/resources">
            Ver todas las categorías
          </Link>
        </Button>
      </div>

       {posts.length === 0 && (
          <Alert className="mb-8 max-w-2xl mx-auto">
            <AlertDescription>No hay artículos en esta categoría todavía.</AlertDescription>
          </Alert>
      )}

      {posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            if (imageUrl) {
              imageUrl = imageUrl.replace('workwellfut.hl1450.dinaserver.com', 'workwellfut.com');
            }
            
            return (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                    {imageUrl && (
                         <div className="relative h-48 w-full mb-4 rounded-t-lg overflow-hidden">
                            <Image 
                                src={imageUrl}
                                alt={post.title.rendered} 
                                fill 
                                className="object-cover"
                                data-ai-hint="resource article"
                            />
                        </div>
                    )}
                    <CardTitle className="text-xl text-accent" dangerouslySetInnerHTML={{ __html: post.title.rendered }}/>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-sm text-foreground/80 [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}/>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/resources/post/${post.slug}`}>
                        Leer más <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: RoutePageProps<{ slug: string }>): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = await getCategoryBySlug(slug);
  return {
    title: `Recursos sobre ${category?.name || 'Categoría'}`,
  };
}
