import { Info, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatVnd } from '@/lib/format';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PriceSummary from './PriceSummary';

function ItemValue({ item }) {
  if (item.text) {
    // "Theo giá nhà nước" and similar: text, with the landlord's explanation behind an info button
    return (
      <span className="inline-flex items-center gap-1">
        {item.text}
        {item.hint && (
          <Popover>
            <PopoverTrigger
              aria-label={`Giải thích: ${item.label}`}
              className="relative grid size-6 place-items-center rounded-full text-muted-foreground after:absolute after:-inset-3 after:content-[''] hover:text-foreground"
            >
              <Info className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="end">{item.hint}</PopoverContent>
          </Popover>
        )}
      </span>
    );
  }
  // A 0 fee is shown as "Miễn phí", never "0 đ" (§5.1)
  if (item.amount === 0) {
    return <span className="font-semibold text-available">Miễn phí</span>;
  }
  return (
    <span className="tabular-nums">
      {formatVnd(item.amount)}
      {item.unit && <span className="text-muted-foreground">/{item.unit}</span>}
    </span>
  );
}

// §5.1: tier 1 side by side, formula line, then line items. Deposit is listed but excluded from the estimate.
export default function CostBreakdown({ rent, estimate, deposit, items, waterPerM3 = false, updatedAt, className }) {
  return (
    <section aria-labelledby="cost-heading" className={cn('flex flex-col gap-4 rounded-lg border bg-card p-4 md:p-5', className)}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="cost-heading" className="text-h2">
          Giá &amp; chi phí
        </h2>
        <p className="text-caption text-muted-foreground">Chủ trọ khai báo, cập nhật {formatDate(updatedAt)}</p>
      </header>

      <PriceSummary rent={rent} estimate={estimate} size="lg" />

      <p className="text-body-sm text-muted-foreground">
        Giá thuê + internet + phí dịch vụ + gửi xe (1 xe) + nước (1 người).{' '}
        {waterPerM3 ? 'Chưa gồm tiền điện và nước theo m³.' : 'Chưa gồm tiền điện.'}
      </p>

      <table className="w-full text-body-sm">
        <caption className="sr-only">Chi tiết các khoản phí</caption>
        <tbody className="divide-y">
          {deposit && (
            <tr>
              <th scope="row" className="py-3 pr-3 text-left align-top font-normal">
                Tiền cọc
                <span className="block text-caption text-muted-foreground">Trả một lần, không tính vào chi phí hằng tháng</span>
              </th>
              <td className="py-3 text-right align-top font-semibold">{deposit}</td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.label}>
              <th scope="row" className="py-3 pr-3 text-left align-top font-normal">
                {item.label}
                {item.note && <span className="block text-caption text-muted-foreground">{item.note}</span>}
              </th>
              <td className="py-3 text-right align-top">
                <ItemValue item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="flex items-center gap-2 border-t pt-3 text-caption text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        Tin đã được HolaNest kiểm duyệt
      </p>
    </section>
  );
}
