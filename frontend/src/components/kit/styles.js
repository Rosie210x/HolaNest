import { cn } from '@/lib/utils';

// Pill chip look, shared with chip-styled links. 40 px visible, 48 px hit area via the pseudo-element (§6.1).
export const chipClass = (selected) =>
  cn(
    'relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-body-sm font-medium whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:-inset-y-1 after:content-[""]',
    selected ? 'border-primary bg-accent text-accent-foreground' : 'border-input bg-card text-foreground hover:bg-muted'
  );
