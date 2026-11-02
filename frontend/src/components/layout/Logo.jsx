import { Link } from 'react-router-dom';
import { House } from 'lucide-react';
import { cn } from '@/lib/utils';

// The header hides the wordmark below 640 px to leave room for the search pill.
// inverse: white wordmark with a yellow mark, for the navy brand band.
export default function Logo({ className, compact = false, inverse = false }) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex h-12 shrink-0 items-center gap-2 rounded-md font-bold',
        inverse ? 'text-brand-foreground' : 'text-foreground',
        className
      )}
      aria-label="Hola Nest - Trang chủ"
    >
      <span
        className={cn(
          'grid size-8 place-items-center rounded-[8px_8px_8px_2px]',
          inverse ? 'bg-highlight text-brand' : 'bg-brand text-brand-foreground'
        )}
      >
        <House className="size-5" strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span className={cn('text-xl tracking-tight', compact && 'hidden sm:inline')}>
        hola<span className={inverse ? 'text-highlight' : 'text-primary'}>nest</span>
      </span>
    </Link>
  );
}
