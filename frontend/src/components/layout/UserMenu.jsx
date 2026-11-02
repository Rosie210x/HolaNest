import { Link, useSubmit } from 'react-router-dom';
import { LayoutDashboard, LogOut, Store, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { hasRole } from './navigation';

function initials(fullName) {
  const words = fullName.trim().split(/\s+/);
  return words.length > 1 ? words[0][0] + words.at(-1)[0] : words[0].slice(0, 2);
}

export default function UserMenu({ user }) {
  const submit = useSubmit();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost-inverse" size="icon" className="rounded-full" aria-label={`Tài khoản của ${user.fullName}`}>
          <Avatar className="size-9 ring-2 ring-highlight">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
            <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground uppercase">
              {initials(user.fullName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
          <span className="truncate text-h3 text-foreground">{user.fullName}</span>
          <span className="truncate text-body-sm font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="min-h-12">
            <Link to="/account">
              <UserRound aria-hidden="true" />
              Tài khoản
            </Link>
          </DropdownMenuItem>
          {hasRole(user, 'LANDLORD') ? (
            <DropdownMenuItem asChild className="min-h-12">
              <Link to="/landlord">
                <Store aria-hidden="true" />
                Kênh chủ trọ
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild className="min-h-12 md:hidden">
              <Link to="/become-landlord">
                <Store aria-hidden="true" />
                Cho thuê phòng
              </Link>
            </DropdownMenuItem>
          )}
          {hasRole(user, 'ADMIN') && (
            <DropdownMenuItem asChild className="min-h-12">
              <Link to="/admin">
                <LayoutDashboard aria-hidden="true" />
                Quản trị
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="min-h-12"
          onSelect={() => submit(null, { method: 'post', action: '/logout' })}
        >
          <LogOut aria-hidden="true" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
