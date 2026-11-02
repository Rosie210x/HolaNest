import { Link } from 'react-router-dom';
import { Camera, Eye, Heart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCount, formatDayMonth, formatDistance } from '@/lib/format';
import { Checkbox } from '@/components/ui/checkbox';
import AvailabilityBadge from './AvailabilityBadge';
import MediaPlaceholder from './MediaPlaceholder';
import PriceSummary from './PriceSummary';
import ScoreBadge from './ScoreBadge';
import VerifiedBadge from './VerifiedBadge';

// §4.1 card anatomy. Order is deliberate: cost before title.
// The title link covers the card; save, compare and the verified badge sit above it so they stay clickable.
export default function ListingCard({ listing, saved = false, onSaveChange, compared = false, onCompareChange, className }) {
  const {
    id,
    title,
    propertyName,
    area,
    rent,
    estimate,
    vacant,
    total,
    rating,
    reviewCount,
    distanceKm,
    school,
    views,
    updatedAt,
    photoCount,
    landlordVerified,
    coverUrl,
    tone,
  } = listing;
  const soldOut = vacant === 0;
  const titleId = `listing-${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group/listing relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-shadow md:hover:shadow-md',
        className
      )}
    >
      <div className={cn('relative aspect-4/3', soldOut && 'opacity-60')}>
        {coverUrl ? (
          <img src={coverUrl} alt={title} loading="lazy" className="size-full object-cover" />
        ) : (
          <MediaPlaceholder tone={tone} className="size-full" />
        )}
        {photoCount > 0 && (
          <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-caption text-white">
            <Camera className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {photoCount}
            <span className="sr-only">ảnh</span>
          </span>
        )}
      </div>

      <AvailabilityBadge vacant={vacant} total={total} className="absolute top-3 left-3" />

      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? 'Bỏ lưu phòng' : 'Lưu phòng'}
        onClick={() => onSaveChange?.(!saved)}
        className="absolute top-1.5 right-1.5 z-10 grid size-11 place-items-center"
      >
        <span className="grid size-8 place-items-center rounded-full bg-background/95 shadow-sm transition-transform active:scale-90">
          <Heart
            className={cn('size-4.5', saved ? 'fill-destructive text-destructive' : 'text-foreground')}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <PriceSummary rent={rent} estimate={estimate} />

        <ScoreBadge score={rating} count={reviewCount} size="sm" />

        <h3 id={titleId} className="line-clamp-2 text-h3">
          <Link
            to={`/rooms/${id}`}
            className="text-primary after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {title}
          </Link>
        </h3>

        <p className="flex items-center gap-1 text-body-sm text-muted-foreground">
          <span className="truncate">
            {propertyName} · {area}
          </span>
          {landlordVerified && <VerifiedBadge iconOnly className="relative z-10 shrink-0" />}
        </p>

        <p className="flex items-start gap-1 text-body-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
          <span>
            {formatDistance(distanceKm)} tới {school}
            <span className="text-muted-foreground"> · đường chim bay</span>
          </span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-1 text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {formatCount(views)} lượt xem · Cập nhật {formatDayMonth(updatedAt)}
          </span>
          <label className="relative z-10 inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 pl-2 text-body-sm font-medium text-foreground">
            <Checkbox checked={compared} onCheckedChange={(value) => onCompareChange?.(value === true)} />
            So sánh
          </label>
        </div>
      </div>
    </article>
  );
}
