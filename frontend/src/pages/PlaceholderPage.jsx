import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';

// Stand-in for screens not built yet, using the empty-state copy each screen will show (§6.2)
export default function PlaceholderPage({ title, icon, emptyTitle, emptyDescription, actionLabel = 'Tìm phòng', actionTo = '/' }) {
  return (
    <div className="page-container flex flex-col gap-6 py-6">
      <h1 className="text-display">{title}</h1>
      <EmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Button asChild>
            <Link to={actionTo}>{actionLabel}</Link>
          </Button>
        }
      />
    </div>
  );
}
