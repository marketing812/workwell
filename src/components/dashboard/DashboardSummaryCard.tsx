
"use client";
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardSummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  ctaLink?: string;
  ctaLabel?: string;
  cardColorClass?: string; 
  iconColorClass?: string; 
}

export function DashboardSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  ctaLink,
  ctaLabel,
  cardColorClass = 'bg-card',
  iconColorClass = 'text-primary',
}: DashboardSummaryCardProps) {
  
  let finalCtaLink = ctaLink;
  if (title === "Área Prioritaria" && ctaLink === "/assessment") {
    finalCtaLink = "/assessment/intro";
  }


  return (
    <Card className={cn('h-full shadow-lg transition-shadow duration-300 hover:shadow-xl', cardColorClass)}>
      <CardHeader className="flex flex-col items-center justify-center space-y-2 p-4 pb-2 text-center">
        <Icon className={cn('h-6 w-6 shrink-0 sm:h-7 sm:w-7', iconColorClass)} />
        <CardTitle className="text-xs font-medium leading-snug sm:text-sm md:text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-center">
        <div className="text-base font-bold leading-tight break-words sm:text-xl md:text-2xl">{value}</div>
        {description && <p className="pt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{description}</p>}
        {finalCtaLink && ctaLabel && (
          <Button asChild variant="link" className="h-auto px-0 pt-3 text-center text-xs leading-tight sm:text-sm">
            <Link href={finalCtaLink}>{ctaLabel}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
