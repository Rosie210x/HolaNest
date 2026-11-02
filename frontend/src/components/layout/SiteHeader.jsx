import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/auth/session';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { RENTER_NAV, hasRole } from './navigation';

// Top bar, 56 px (docs/ui-blueprint.md §3.2). Mobile: logo · search pill · account.
// ≥768 px: logo · main nav · landlord entry · account.
export default function SiteHeader() {
  const user = useCurrentUser();
  const { pathname, search } = useLocation();
  const onAuthPage = pathname === '/login' || pathname === '/signup';
  const loginHref = onAuthPage ? '/login' : `/login?next=${encodeURIComponent(pathname + search)}`;

  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="page-container flex h-full items-center gap-3">
        <Logo compact />

        <Link
          to="/"
          className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border bg-surface px-4 text-body-sm text-muted-foreground md:hidden"
        >
          <Search className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span className="truncate">Tìm phòng, khu vực</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="ml-4 hidden items-center gap-1 md:flex">
          {RENTER_NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'inline-flex h-12 items-center rounded-md px-3 text-body-sm font-medium transition-colors hover:bg-muted hover:text-foreground',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {hasRole(user, 'LANDLORD') ? (
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link to="/landlord">Kênh chủ trọ</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="hidden text-primary md:inline-flex">
              <Link to="/become-landlord">Cho thuê phòng</Link>
            </Button>
          )}

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild size="sm" className="h-10 px-4">
              <Link to={loginHref}>Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
