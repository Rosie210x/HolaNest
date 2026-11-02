import { Link } from 'react-router-dom';
import TrustNote from '@/components/kit/TrustNote';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const FOOTER_LINKS = [
  {
    title: 'Người thuê',
    links: [
      { to: '/', label: 'Tìm phòng' },
      { to: '/saved', label: 'Phòng đã lưu' },
      { to: '/requests', label: 'Yêu cầu xem phòng' },
    ],
  },
  {
    title: 'Chủ trọ',
    links: [
      { to: '/become-landlord', label: 'Cho thuê phòng' },
      { to: '/landlord', label: 'Kênh chủ trọ' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-surface">
      <div className="page-container grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 lg:col-span-2">
          <Logo className="self-start" />
          <p className="text-body-sm text-muted-foreground">Tìm trọ quanh Hòa Lạc: giá thật, phòng còn trống thật.</p>
          {/* §5.4 anti-deposit warning */}
          <TrustNote />
        </div>

        {FOOTER_LINKS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-h3">{group.title}</h2>
            <ul className="mt-1">
              {group.links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex min-h-12 items-center text-body-sm text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t">
        <div className="page-container flex items-center justify-between gap-4 py-2">
          <p className="text-caption text-muted-foreground">© {new Date().getFullYear()} Hola Nest</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
