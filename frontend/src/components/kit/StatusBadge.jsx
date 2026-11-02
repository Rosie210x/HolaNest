import { cn } from '@/lib/utils';

// Every status renders as dot + text, never colour alone (§2.2, WCAG 1.4.1)
const TONES = {
  neutral: 'bg-unavailable-bg text-unavailable',
  warning: 'bg-warning-bg text-warning',
  available: 'bg-available-bg text-available',
  destructive: 'bg-destructive/10 text-destructive',
  verified: 'bg-verified/10 text-verified',
  primary: 'bg-primary text-primary-foreground',
};

const STATUS_MAP = {
  listing: {
    DRAFT: ['Nháp', 'neutral'],
    PENDING: ['Chờ duyệt', 'warning'],
    APPROVED: ['Đang hiển thị', 'available'],
    REJECTED: ['Bị từ chối', 'destructive'],
    HIDDEN: ['Đã ẩn', 'neutral'],
  },
  request: {
    PENDING: ['Chờ xác nhận', 'warning'],
    CONFIRMED: ['Đã xác nhận', 'verified'],
    REJECTED: ['Từ chối', 'destructive'],
    CANCELLED: ['Đã hủy', 'neutral'],
    EXPIRED: ['Hết hạn', 'neutral'],
    NO_SHOW: ['Không đến', 'neutral'],
    VIEWED: ['Đã xem', 'available'],
    RENTED: ['Đã thuê', 'primary'],
  },
  landlord: {
    PENDING: ['Chờ duyệt', 'warning'],
    APPROVED: ['Đã duyệt', 'available'],
    REJECTED: ['Bị từ chối', 'destructive'],
  },
};

const HIDDEN_BY = { OWNER: 'Chủ trọ ẩn', ADMIN: 'Admin ẩn', EXPIRED: 'Quá hạn' };

export default function StatusBadge({ entity, status, hiddenBy, className }) {
  const [label, tone] = STATUS_MAP[entity]?.[status] ?? [status, 'neutral'];
  const reason = status === 'HIDDEN' && HIDDEN_BY[hiddenBy];

  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit items-center gap-1.5 rounded-sm px-2 text-caption font-semibold whitespace-nowrap',
        TONES[tone],
        // An admin hide is a moderation action, so it carries a destructive outline
        hiddenBy === 'ADMIN' && 'ring-1 ring-destructive ring-inset',
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {reason ? `${label} · ${reason}` : label}
    </span>
  );
}
