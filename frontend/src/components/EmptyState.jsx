import { cn } from '@/lib/utils';

// §6.2 empty list: message plus the action that fills it
export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center', className)}>
      {Icon && (
        <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <h2 className="text-h2">{title}</h2>
      {description && <p className="max-w-md text-body-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
