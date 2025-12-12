
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { type ResourcePost } from '@/data/resourcesData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

export default function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [post, setPost] = useState<ResourcePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/resources/post/${slug}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setError("Artículo no encontrado.");
                } else {
                    throw new Error('No se pudo cargar el artículo');
                }
            } else {
                const data = await res.json();
                setPost(data);
            }
        } catch (e) {
            setError("No se pudo cargar el artículo. Por favor, inténtalo de nuevo más tarde.");
            console.error(`Error fetching post ${slug}:`, e);
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
            <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            </Alert>
             <div className="mt-8">
                <Button variant="outline" asChild>
                <Link href="/resources">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Recursos
                </Link>
                </Button>
            </div>
        </div>
    );
  }

  if (!post) {
      // This state should ideally be covered by the error state now
      return <div className="container mx-auto py-8 text-center">Artículo no encontrado.</div>
  }

  let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  if (imageUrl) {
    imageUrl = imageUrl.replace('workwellfut.hl1450.dinaserver.com', 'workwellfut.com');
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="border-b p-0">
            {imageUrl && (
                <div className="relative h-64 w-full">
                    <Image 
                        src={imageUrl} 
                        alt={post.title.rendered} 
                        fill 
                        className="object-cover"
                        data-ai-hint="resource article header"
                    />
                </div>
            )}
            <div className="p-6">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                
                <CardDescription className="flex flex-wrap items-center text-sm text-muted-foreground pt-2 gap-x-4 gap-y-1">
                    <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" /> Publicado el {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="py-6 px-6 md:px-8">
            <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Recursos
          </Link>
        </Button>
      </div>
    </div>
  );
}
