import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Section title + one-line subtitle + optional "Xem tất cả" link on the right
export default function SectionHeader({ id, title, description, actionLabel, actionTo, className }) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h2 id={id} className="text-display">
          {title}
        </h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actionTo && (
        <Link
          to={actionTo}
          className="inline-flex min-h-12 shrink-0 items-center gap-0.5 text-body-sm font-semibold text-primary hover:underline"
        >
          {actionLabel}
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
