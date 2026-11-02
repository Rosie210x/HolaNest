import { Link } from 'react-router-dom';
import { House } from 'lucide-react';
import { cn } from '@/lib/utils';

// The header hides the wordmark below 640 px to leave room for the search pill
export default function Logo({ className, compact = false }) {
  return (
    <Link
      to="/"
      className={cn('inline-flex h-12 shrink-0 items-center gap-2 rounded-md font-bold text-foreground', className)}
      aria-label="Hola Nest - Trang chủ"
    >
      <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
        <House className="size-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className={cn('text-lg tracking-tight', compact && 'hidden sm:inline')}>
        hola<span className="text-primary">nest</span>
      </span>
    </Link>
  );
}
