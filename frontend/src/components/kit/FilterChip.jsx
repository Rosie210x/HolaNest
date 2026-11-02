import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chipClass } from './styles';

// Quick filters and active-filter rows (§4.1).
// selected → toggle chip (aria-pressed). onRemove → the whole chip removes the filter.
export default function FilterChip({ selected = false, onClick, onRemove, icon: Icon, className, children }) {
  const removable = Boolean(onRemove);

  return (
    <button
      type="button"
      aria-pressed={removable ? undefined : selected}
      aria-label={removable ? `Bỏ lọc ${children}` : undefined}
      onClick={removable ? onRemove : onClick}
      className={cn(chipClass(selected || removable), className)}
    >
      {Icon && <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />}
      {children}
      {removable && <X className="-mr-1 size-4" strokeWidth={2} aria-hidden="true" />}
    </button>
  );
}
