import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Visible label, error under the field linked with aria-describedby (docs/ui-blueprint.md §6.1)
export default function FormField({ id, label, error, className, ...inputProps }) {
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-body-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
