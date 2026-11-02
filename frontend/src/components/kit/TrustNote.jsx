import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

// §5.4 anti-deposit warning: static copy, shown in the right rail, above the action bar, on SC04 and in the footer
export default function TrustNote({ className }) {
  return (
    <p className={cn('flex items-start gap-2 text-body-sm text-foreground', className)}>
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
      HolaNest không thu tiền cọc. Đừng chuyển khoản cho ai trước khi xem phòng.
    </p>
  );
}
