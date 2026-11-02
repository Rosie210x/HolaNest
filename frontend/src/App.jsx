import { Outlet, useMatches, useNavigation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import BottomTabBar from '@/components/layout/BottomTabBar';

// Renter shell. A route sets handle: { hideTabBar: true } when it brings its own bottom bar (SC02) or is a focused flow.
export default function App() {
  const navigation = useNavigation();
  const showTabBar = !useMatches().some((match) => match.handle?.hideTabBar);

  return (
    <div
      className={cn(
        'flex min-h-dvh flex-col',
        // Keep the last content above the fixed tab bar (§3.3 rule 4)
        showTabBar && 'pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))] md:pb-0'
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-70 focus:rounded-md focus:bg-background focus:px-4 focus:py-3"
      >
        Bỏ qua điều hướng
      </a>

      {/* §6.2: 2 px top progress bar while the next page loads */}
      {navigation.state !== 'idle' && (
        <div role="progressbar" aria-label="Đang tải" className="fixed inset-x-0 top-0 z-70 h-0.5 overflow-hidden bg-primary/20">
          <div className="h-full w-1/3 animate-pulse bg-primary" />
        </div>
      )}

      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      {showTabBar && <BottomTabBar />}
    </div>
  );
}
