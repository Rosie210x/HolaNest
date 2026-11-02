import { BadgeCheck, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Every badge explains what was checked when tapped (§1.3 principle 4, §5.4)
const KINDS = {
  landlord: {
    label: 'Đã xác minh',
    icon: BadgeCheck,
    explanation: 'HolaNest đã gọi điện xác minh số điện thoại của chủ trọ.',
  },
  visit: {
    label: 'Đã đi xem phòng',
    icon: Footprints,
    explanation: 'Người viết đã đặt lịch qua HolaNest và chủ trọ xác nhận họ đã đến xem phòng.',
  },
};

export default function VerifiedBadge({ kind = 'landlord', iconOnly = false, className }) {
  const { label, icon: Icon, explanation } = KINDS[kind];

  return (
    <Popover>
      <PopoverTrigger
        aria-label={iconOnly ? label : undefined}
        className={cn(
          // The pseudo-element stretches the hit area to 48 px without changing the visual size (§6.1)
          'relative inline-flex h-6 w-fit items-center gap-1 rounded-sm font-semibold whitespace-nowrap text-verified after:absolute after:-inset-3 after:content-[""]',
          iconOnly ? 'px-0' : 'bg-verified/10 px-2 text-caption',
          className
        )}
      >
        <Icon className={iconOnly ? 'size-5' : 'size-4'} strokeWidth={2} aria-hidden="true" />
        {!iconOnly && label}
      </PopoverTrigger>
      <PopoverContent align="start" className="flex gap-2">
        <Icon className="mt-0.5 size-5 shrink-0 text-verified" strokeWidth={1.75} aria-hidden="true" />
        <p>
          <span className="font-semibold">{label}.</span> {explanation}
        </p>
      </PopoverContent>
    </Popover>
  );
}
