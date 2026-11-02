import { cn } from '@/lib/utils';
import { formatMillions, formatVnd } from '@/lib/format';

// Rent never appears without the fixed monthly estimate (§1.3 principle 1).
// "card": shortened money for listing cards. "lg": tier 1 of the cost card, both numbers side by side,
// the estimate visually stronger because it is the number renters budget with (§5.1).
export default function PriceSummary({ rent, estimate, size = 'card', className }) {
  if (size === 'lg') {
    return (
      <dl className={cn('grid grid-cols-2 gap-2 sm:gap-3', className)}>
        <div className="flex flex-col gap-1 rounded-lg bg-surface p-3">
          <dt className="text-body-sm text-muted-foreground">Giá thuê</dt>
          <dd className="text-price-card md:text-h1">{formatVnd(rent)}</dd>
          <dd className="text-caption text-muted-foreground">mỗi tháng</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-lg bg-accent p-3 text-accent-foreground ring-1 ring-primary/40 ring-inset">
          <dt className="text-body-sm">Chi phí cố định ước tính</dt>
          <dd className="text-price-card md:text-price-lg">{formatVnd(estimate)}</dd>
          <dd className="text-caption">mỗi tháng</dd>
        </div>
      </dl>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <p className="text-price-card">
        {formatMillions(rent)}
        <span className="text-body-sm font-normal text-muted-foreground">/tháng</span>
      </p>
      <p className="text-body-sm">
        Chi phí cố định ước tính <span className="font-semibold tabular-nums">{formatMillions(estimate)}</span>
      </p>
    </div>
  );
}
