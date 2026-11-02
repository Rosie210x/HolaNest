import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/auth/session';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { RENTER_NAV, hasRole } from './navigation';

// Navy brand band (docs/ui-blueprint.md §2.5, §3.2).
// Row 1, sticky, 56 px: logo · search pill (mobile) · landlord entry · account.
// Row 2, ≥768 px only, scrolls away: main nav as pills; the active one gets a white outline.
export default function SiteHeader() {
  const user = useCurrentUser();
  const { pathname, search } = useLocation();
  const onAuthPage = pathname === '/login' || pathname === '/signup';
  const loginHref = onAuthPage ? '/login' : `/login?next=${encodeURIComponent(pathname + search)}`;

  return (
    <>
      <header className="sticky top-0 z-40 h-(--header-height) bg-brand text-brand-foreground">
        <div className="page-container flex h-full items-center gap-3">
          <Logo compact inverse />

          <Link
            to="/"
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-sm bg-background px-3 text-body-sm text-muted-foreground ring-2 ring-highlight md:hidden"
          >
            <Search className="size-5 shrink-0 text-foreground" strokeWidth={2} aria-hidden="true" />
            <span className="truncate">Tìm phòng, khu vực</span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            {hasRole(user, 'LANDLORD') ? (
              <Button asChild variant="ghost-inverse" className="hidden md:inline-flex">
                <Link to="/landlord">Kênh chủ trọ</Link>
              </Button>
            ) : (
              <Button asChild variant="ghost-inverse" className="hidden md:inline-flex">
                <Link to="/become-landlord">Cho thuê phòng</Link>
              </Button>
            )}

            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                {!onAuthPage && (
                  <Button asChild variant="inverse" size="sm" className="hidden h-10 px-3 md:inline-flex">
                    <Link to="/signup">Đăng ký</Link>
                  </Button>
                )}
                <Button asChild variant="inverse" size="sm" className="ml-1 h-10 px-3">
                  <Link to={loginHref}>Đăng nhập</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <nav aria-label="Điều hướng chính" className="hidden bg-brand pb-2 md:block">
        <ul className="page-container flex items-center gap-2">
          {RENTER_NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex h-11 items-center gap-2 rounded-full border px-4 text-body-sm font-medium text-brand-foreground transition-colors',
                    isActive ? 'border-brand-foreground bg-brand-foreground/10' : 'border-transparent hover:bg-brand-foreground/10'
                  )
                }
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
