import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';

export default function NotFoundPage() {
  return (
    <div className="page-container py-8">
      <EmptyState
        icon={SearchX}
        title="Không tìm thấy trang"
        action={
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
        }
      />
    </div>
  );
}
