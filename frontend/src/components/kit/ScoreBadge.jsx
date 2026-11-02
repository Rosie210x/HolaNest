import { cn } from '@/lib/utils';
import { formatCount, formatScore } from '@/lib/format';

const SCORE_WORDS = [
  [4.5, 'Tuyệt hảo'],
  [4.0, 'Rất tốt'],
  [3.5, 'Tốt'],
  [3.0, 'Khá'],
];

const scoreWord = (score) => SCORE_WORDS.find(([min]) => score >= min)?.[1];

// Score box with the open bottom-left corner, a word for the score and the review count.
// Never a score without its count; 0 reviews → "Chưa có đánh giá" (BR23, §5.4).
export default function ScoreBadge({ score, count, size = 'md', className }) {
  if (!count) {
    return <span className={cn('text-body-sm text-muted-foreground', className)}>Chưa có đánh giá</span>;
  }

  const word = scoreWord(score);
  const compact = size === 'sm';

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid place-items-center rounded-[6px_6px_6px_0] bg-score font-bold text-score-foreground tabular-nums',
          compact ? 'h-7 min-w-7 px-1 text-body-sm' : 'h-9 min-w-9 px-1.5 text-base'
        )}
      >
        {formatScore(score)}
      </span>
      <span className="sr-only">
        Điểm {formatScore(score)} trên 5, {formatCount(count)} đánh giá
      </span>
      <span aria-hidden="true" className={cn('flex leading-tight', compact ? 'flex-row items-baseline gap-1.5' : 'flex-col')}>
        {word && <span className={cn('font-semibold', compact ? 'text-body-sm' : 'text-base')}>{word}</span>}
        <span className={cn('text-muted-foreground', compact ? 'text-caption' : 'text-body-sm')}>
          {formatCount(count)} đánh giá
        </span>
      </span>
    </span>
  );
}
