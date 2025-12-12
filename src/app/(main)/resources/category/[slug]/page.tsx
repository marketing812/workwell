
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { type ResourcePost, type ResourceCategory } from '@/data/resourcesData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

// Este componente ahora es cliente y recibe `slug` como prop.
function CategoryClientPage({ slug }: { slug: string }) {
  const [category, setCategory] = useState<ResourceCategory | null>(null);
  const [posts, setPosts] = useState<ResourcePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/resources/category/${slug}`);
        if (!res.ok) {
          throw new Error('No se pudo cargar la categoría');
        }
        const data = await res.json();
        if (!data.category) {
            throw new Error('Categoría no encontrada');
        }
        setCategory(data.category);
        setPosts(data.posts);
      } catch (e: any) {
        setError(e.message || "No se pudieron cargar los artículos de esta categoría.");
        console.error(`Error fetching data for category ${slug}:`, e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/resources">
            Ver todas las categorías
          </Link>
        </Button>
      </div>
    );
  }

  if (!category) {
      return (
         <div className="container mx-auto py-8 text-center">
            <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Categoría no encontrada.</AlertDescription>
            </Alert>
            <Button asChild variant="outline">
            <Link href="/resources">
                Ver todas las categorías
            </Link>
            </Button>
      </div>
      )
  }

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


// Este es el componente de servidor que extrae el slug y lo pasa al componente de cliente.
export default function CategoryPage({ params }: { params: { slug: string } }) {
    return <CategoryClientPage slug={params.slug} />;
}
