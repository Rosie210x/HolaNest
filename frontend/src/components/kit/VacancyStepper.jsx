import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// SC16 two-tap vacancy update (UC20): each tap commits, the parent applies it optimistically with an undo toast (§4.4)
export default function VacancyStepper({ value, total, onChange, disabled = false, className }) {
  return (
    <div role="group" aria-label="Phòng trống" className={cn('inline-flex items-center gap-2', className)}>
      <span className="text-body-sm text-muted-foreground">Phòng trống</span>
      <div className="inline-flex items-center rounded-md border border-input">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-r-none text-primary"
          aria-label="Giảm 1 phòng trống"
          disabled={disabled || value <= 0}
          onClick={() => onChange(value - 1)}
        >
          <Minus aria-hidden="true" />
        </Button>
        <output aria-live="polite" className="min-w-14 text-center text-h3 tabular-nums">
          {value}
          <span className="text-muted-foreground">/{total}</span>
        </output>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-l-none text-primary"
          aria-label="Tăng 1 phòng trống"
          disabled={disabled || value >= total}
          onClick={() => onChange(value + 1)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
