import { Form as RouterForm } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/auth/session';

const ROLE_LABELS = { RENTER: 'Người thuê', LANDLORD: 'Chủ trọ', ADMIN: 'Quản trị viên' };

export default function AccountPage() {
  const user = useCurrentUser();

  return (
    <div className="page-container flex flex-col gap-6 py-6">
      <h1 className="text-display">Tài khoản</h1>
      <Card className="max-w-xl">
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-body-sm">
            <dt className="text-muted-foreground">Họ và tên</dt>
            <dd className="font-medium">{user.fullName}</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium break-all">{user.email}</dd>
            <dt className="text-muted-foreground">Số điện thoại</dt>
            <dd className="font-medium">{user.phone}</dd>
            <dt className="text-muted-foreground">Vai trò</dt>
            <dd className="flex flex-wrap gap-1.5">
              {user.roles.map((role) => (
                <Badge key={role} variant="secondary">
                  {ROLE_LABELS[role] ?? role}
                </Badge>
              ))}
            </dd>
          </dl>
        </CardContent>
      </Card>
      <RouterForm method="post" action="/logout">
        <Button type="submit" variant="outline">
          <LogOut aria-hidden="true" />
          Đăng xuất
        </Button>
      </RouterForm>
    </div>
  );
}
