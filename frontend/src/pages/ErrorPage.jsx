import { useRevalidator } from 'react-router-dom';
import { CloudOff, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import SiteHeader from '@/components/layout/SiteHeader';

// Root error boundary: a failed loader (e.g. API unreachable) still gets the shell and a retry (§6.2)
export default function ErrorPage() {
  const revalidator = useRevalidator();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="page-container flex-1 py-8">
        <EmptyState
          icon={CloudOff}
          title="Đã có lỗi xảy ra"
          description="Không tải được dữ liệu. Kiểm tra kết nối mạng rồi thử lại."
          action={
            <Button onClick={() => revalidator.revalidate()} disabled={revalidator.state === 'loading'}>
              <RotateCw className={revalidator.state === 'loading' ? 'animate-spin' : undefined} aria-hidden="true" />
              Thử lại
            </Button>
          }
        />
      </main>
    </div>
  );
}
