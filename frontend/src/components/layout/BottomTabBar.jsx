import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { TAB_BAR_NAV } from './navigation';

// Mobile bottom tabs, 56 px + safe area, below 768 px only (docs/ui-blueprint.md §3.2, §3.3)
export default function BottomTabBar() {
  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-(--tabbar-height) grid-cols-4">
        {TAB_BAR_NAV.map(({ to, shortLabel, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex h-full flex-col items-center justify-center gap-0.5 text-caption transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              {shortLabel}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
