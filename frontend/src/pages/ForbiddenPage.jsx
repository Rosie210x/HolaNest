import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';

export default function ForbiddenPage() {
  return (
    <div className="page-container py-8">
      <EmptyState
        icon={ShieldX}
        title="Bạn không có quyền truy cập trang này"
        action={
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
        }
      />
    </div>
  );
}
