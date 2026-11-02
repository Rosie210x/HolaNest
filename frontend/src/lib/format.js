// vi-VN formatting rules from SRS §5.2 and docs/ui-blueprint.md §2.3
const number = new Intl.NumberFormat('vi-VN');
const oneDecimal = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 });
const twoDecimals = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
const dayMonth = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
const fullDate = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

const DAY_MS = 24 * 60 * 60 * 1000;

// 2500000 → "2.500.000 đ"
export const formatVnd = (amount) => `${number.format(amount)} đ`;

// 2870000 → "2,87 triệu"; card-sized money (§4.1)
export const formatMillions = (amount) => `${twoDecimals.format(amount / 1_000_000)} triệu`;

// 0.84 → "0,8 km"; distances are rounded to 0,1 km (BR12)
export const formatDistance = (km) => `${oneDecimal.format(Math.round(km * 10) / 10)} km`;

export const formatCount = (value) => number.format(value);

// 4.6 → "4,6"
export const formatScore = (score) => oneDecimal.format(score);

// "10/10" for card meta, "10/10/2026" elsewhere
export const formatDayMonth = (date) => dayMonth.format(new Date(date));
export const formatDate = (date) => fullDate.format(new Date(date));

// Freshness (§5.4): relative under 7 days, else dd/MM/yyyy
export function formatFreshness(date, now = new Date()) {
  const days = Math.floor((now - new Date(date)) / DAY_MS);
  if (days <= 0) {
    return 'hôm nay';
  }
  if (days === 1) {
    return 'hôm qua';
  }
  return days < 7 ? `${days} ngày trước` : formatDate(date);
}
