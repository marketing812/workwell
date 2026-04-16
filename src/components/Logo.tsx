
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/lib/translations';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  imageClassName,
  white = false,
}: {
  className?: string;
  imageClassName?: string;
  white?: boolean;
}) {
  const t = useTranslations();
  return (
    <Link href="/welcome" className={cn('flex items-center', className)}>
      <Image
        src="/logo-emotiva-color.svg"
        alt={t.appName}
        width={132}
        height={32}
        className={cn(
          'h-8 w-auto',
          imageClassName,
          white ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'
        )}
        priority
      />
    </Link>
  );
}
