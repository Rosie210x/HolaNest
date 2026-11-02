import { House } from 'lucide-react';
import { cn } from '@/lib/utils';

// Stand-in imagery until listing photos come from the API. Illustrative gradients, not tokens: they carry no meaning.
const TONES = [
  'from-[#003b95] to-[#2f87f0]',
  'from-[#00695c] to-[#4db6ac]',
  'from-[#9a4a00] to-[#ffb700]',
  'from-[#4c1d95] to-[#8b5cf6]',
  'from-[#1e293b] to-[#64748b]',
  'from-[#9f1239] to-[#f472b6]',
];

export default function MediaPlaceholder({ tone = 0, icon: Icon = House, className, children }) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-linear-to-br text-white',
        TONES[tone % TONES.length],
        className
      )}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1}
        className="absolute -right-[8%] -bottom-[12%] -z-10 size-[70%] max-h-56 max-w-56 opacity-20"
      />
      {children}
    </div>
  );
}
