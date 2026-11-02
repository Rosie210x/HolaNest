import { CalendarCheck, Heart, Search, UserRound } from 'lucide-react';

// Renter shell navigation (docs/ui-blueprint.md §3.2). Saved, requests and account need a session;
// their route loaders send guests to /login and back.
export const RENTER_NAV = [
  { to: '/', label: 'Tìm phòng', shortLabel: 'Tìm phòng', icon: Search, end: true },
  { to: '/saved', label: 'Phòng đã lưu', shortLabel: 'Đã lưu', icon: Heart },
  { to: '/requests', label: 'Yêu cầu xem phòng', shortLabel: 'Yêu cầu', icon: CalendarCheck },
];

// Mobile only: the desktop header keeps the account in its menu instead.
// Post-MVP modules (roommate, pass phòng, chợ đồ cũ) take one extra slot here, so learned tab positions stay put.
export const TAB_BAR_NAV = [
  ...RENTER_NAV,
  { to: '/account', label: 'Tài khoản', shortLabel: 'Tài khoản', icon: UserRound },
];

export const hasRole = (user, role) => Boolean(user?.roles?.includes(role));
