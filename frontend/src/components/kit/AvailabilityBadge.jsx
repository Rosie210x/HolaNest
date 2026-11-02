import { cn } from '@/lib/utils';

// "Còn N phòng" / "Hết phòng" (BR05). Sold out is a neutral state, not an error, and never a countdown or urgency cue.
export default function AvailabilityBadge({ vacant, total, className }) {
  const available = vacant > 0;

  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit items-center gap-1.5 rounded-sm px-2 text-caption font-semibold whitespace-nowrap',
        available ? 'bg-available-bg text-available' : 'bg-unavailable-bg text-unavailable',
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {available ? `Còn ${vacant}${total ? `/${total}` : ''} phòng` : 'Hết phòng'}
    </span>
  );
}
