import { useState } from 'react';
import { CircleAlert, Heart, Snowflake, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import FormField from '@/components/FormField';
import EmptyState from '@/components/EmptyState';
import AvailabilityBadge from '@/components/kit/AvailabilityBadge';
import CostBreakdown from '@/components/kit/CostBreakdown';
import FilterChip from '@/components/kit/FilterChip';
import ListingCard from '@/components/kit/ListingCard';
import PriceSummary from '@/components/kit/PriceSummary';
import ScoreBadge from '@/components/kit/ScoreBadge';
import SearchBar from '@/components/kit/SearchBar';
import SectionHeader from '@/components/kit/SectionHeader';
import StatusBadge from '@/components/kit/StatusBadge';
import TrustNote from '@/components/kit/TrustNote';
import VacancyStepper from '@/components/kit/VacancyStepper';
import VerifiedBadge from '@/components/kit/VerifiedBadge';
import { SAMPLE_COST_ITEMS, SAMPLE_LISTINGS } from '@/data/sampleContent';

// Living reference for docs/ui-blueprint.md §2 (tokens) and §6.4 (components). Toggle the theme in the footer to check dark mode.
const COLOR_GROUPS = [
  {
    title: 'Thương hiệu & hành động',
    tokens: [
      ['brand', '#003B95', 'Dải header, hero, khối điểm'],
      ['primary', '#006CE4', 'Nút chính, liên kết, vòng focus'],
      ['primary-hover', '#0057B8', 'Hover của nút chính'],
      ['highlight', '#FFB700', 'Khung tìm kiếm, ưu đãi'],
      ['accent', '#EBF3FF', 'Nền chip đang chọn, ô ước tính'],
    ],
  },
  {
    title: 'Trung tính',
    tokens: [
      ['foreground', '#1A1A1A', 'Chữ chính, giá'],
      ['muted-foreground', '#595959', 'Chữ phụ, ngày, lượt xem'],
      ['background', '#FFFFFF', 'Nền trang, thẻ'],
      ['surface', '#F5F5F5', 'Dải nền section'],
      ['border', '#E7E7E7', 'Viền thẻ'],
      ['input', '#868686', 'Viền ô nhập (3:1)'],
    ],
  },
  {
    title: 'Trạng thái',
    tokens: [
      ['available', '#008234', 'Còn phòng, Đang hiển thị'],
      ['unavailable', '#595959', 'Hết phòng (trung tính)'],
      ['verified', '#00796B', 'Đã xác minh, Đã đi xem phòng'],
      ['warning', '#92400E', 'Chờ duyệt, sắp hết hạn'],
      ['destructive', '#D4111E', 'Lỗi, Từ chối, Xóa'],
      ['score', '#003B95', 'Khối điểm đánh giá'],
      ['ai', '#6D28D9', 'Trợ lý AI'],
    ],
  },
];

const TYPE_SCALE = [
  ['text-hero', 'Tìm trọ quanh Hòa Lạc', '32/40 → 48/60 · 700'],
  ['text-display', 'Khu vực được tìm nhiều', '24/32 → 30/38 · 700'],
  ['text-h1', 'Phòng khép kín có ban công', '22/30 → 28/36 · 700'],
  ['text-h2', 'Giá & chi phí', '18/26 → 20/28 · 600'],
  ['text-h3', 'Nhà trọ Hoa Sữa', '16/24 · 600'],
  ['text-lead', 'Phòng còn trống thật, chủ trọ đã xác minh.', '18/28 → 22/32 · 400'],
  ['text-base', 'Nội dung mặc định, không nhỏ hơn 16 px trong ô nhập.', '16/24 · 400'],
  ['text-body-sm', '1.284 lượt xem · Cập nhật 10/10', '14/20 · 400'],
  ['text-caption', 'Chủ trọ khai báo, cập nhật 10/10/2026', '12/16 · 500'],
  ['text-price-lg', '2.870.000 đ', '28/32 · 700 · tabular'],
  ['text-price-card', '2,5 triệu/tháng', '20/28 · 700 · tabular'],
];

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

const RADII = [
  ['rounded-sm', '4', 'Nút, badge'],
  ['rounded-md', '6', 'Ô nhập, ô trong khung tìm kiếm'],
  ['rounded-lg', '8', 'Thẻ, cost card'],
  ['rounded-xl', '12', 'Ô khu vực, banner'],
  ['rounded-2xl', '16', 'Sheet, dialog'],
  ['rounded-full', '∞', 'Chip, avatar'],
];

const SHADOWS = [
  ['shadow-sm', 'Thẻ ưu đãi'],
  ['shadow-md', 'Hover thẻ (desktop), khung tìm kiếm, thanh dính'],
  ['shadow-lg', 'Popover, dialog'],
];

const STATUSES = [
  ['listing', ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED']],
  ['request', ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'VIEWED', 'RENTED']],
  ['landlord', ['PENDING', 'APPROVED', 'REJECTED']],
];

const SECTIONS = [
  ['colors', 'Màu sắc'],
  ['type', 'Chữ'],
  ['foundations', 'Khoảng cách · bo góc · đổ bóng'],
  ['buttons', 'Nút'],
  ['forms', 'Form & tìm kiếm'],
  ['badges', 'Badge & tín hiệu tin cậy'],
  ['pricing', 'Giá & chi phí'],
  ['cards', 'Thẻ tin đăng'],
  ['landlord', 'Chủ trọ'],
  ['feedback', 'Phản hồi'],
];

function KitSection({ id, title, description, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-20 flex-col gap-4 border-t pt-8">
      <div>
        <h2 id={`${id}-title`} className="text-display">
          {title}
        </h2>
        {description && <p className="mt-1 max-w-3xl text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Specimen({ label, className, children }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-caption text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function UiKitPage() {
  const [vacancy, setVacancy] = useState(2);
  const [chips, setChips] = useState(['dieu_hoa']);
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(true);

  const toggleChip = (key) => setChips((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));

  return (
    <div className="page-container flex flex-col gap-10 py-8">
      <header className="flex flex-col gap-3">
        <p className="text-caption text-muted-foreground uppercase">Hola Nest design system</p>
        <h1 className="text-hero">UI kit</h1>
        <p className="max-w-3xl text-lead text-muted-foreground">
          Token, nền tảng và component dùng chung. Đặc tả nằm ở docs/ui-blueprint.md §2 và §6.4; trang này là bản chạy thật của chúng.
        </p>
        <nav aria-label="Mục lục UI kit" className="scroll-row gap-2 py-1">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="inline-flex h-10 items-center rounded-full border border-input px-4 text-body-sm font-medium hover:bg-muted">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <KitSection id="colors" title="Màu sắc" description="Mã hex là giá trị ở giao diện sáng; ô màu đọc trực tiếp CSS variable nên đổi theo giao diện tối.">
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            <h3 className="text-h3">{group.title}</h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {group.tokens.map(([token, hex, use]) => (
                <li key={token} className="overflow-hidden rounded-lg border">
                  <div className="h-16 border-b" style={{ background: `var(--${token})` }} />
                  <div className="flex flex-col p-2">
                    <code className="text-caption font-semibold">--{token}</code>
                    <span className="text-caption text-muted-foreground tabular-nums">{hex}</span>
                    <span className="text-caption text-muted-foreground">{use}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </KitSection>

      <KitSection id="type" title="Chữ" description="Be Vietnam Pro 400/500/600/700. Line height tiêu đề ≥ 1,25 để dấu chồng (Ở, Ắ) không bị cắt.">
        <ul className="divide-y rounded-lg border">
          {TYPE_SCALE.map(([cls, sample, spec]) => (
            <li key={cls} className="flex flex-col gap-1 p-3 md:flex-row md:items-baseline md:gap-6">
              <code className="w-36 shrink-0 text-caption text-muted-foreground">{cls}</code>
              <span className={cn(cls, 'min-w-0 flex-1')}>{sample}</span>
              <span className="shrink-0 text-caption text-muted-foreground">{spec}</span>
            </li>
          ))}
        </ul>
      </KitSection>

      <KitSection id="foundations" title="Khoảng cách · bo góc · đổ bóng">
        <div className="grid gap-6 lg:grid-cols-3">
          <Specimen label="Khoảng cách, bước 4 px">
            <ul className="flex w-full flex-col gap-1.5">
              {SPACING.map((px) => (
                <li key={px} className="flex items-center gap-3">
                  <span className="w-8 text-right text-caption text-muted-foreground tabular-nums">{px}</span>
                  <span className="h-3 rounded-sm bg-primary" style={{ width: px * 2 }} />
                </li>
              ))}
            </ul>
          </Specimen>
          <Specimen label="Bo góc (px)">
            {RADII.map(([cls, px, use]) => (
              <div key={cls} className="flex flex-col items-center gap-1 text-center">
                <span className={cn('size-14 border-2 border-primary bg-accent', cls)} />
                <code className="text-caption">{px}</code>
                <span className="w-20 text-caption text-muted-foreground">{use}</span>
              </div>
            ))}
          </Specimen>
          <Specimen label="Đổ bóng">
            {SHADOWS.map(([cls, use]) => (
              <div key={cls} className={cn('flex h-20 w-full flex-col justify-center rounded-lg bg-card px-3', cls)}>
                <code className="text-caption font-semibold">{cls}</code>
                <span className="text-caption text-muted-foreground">{use}</span>
              </div>
            ))}
          </Specimen>
        </div>
      </KitSection>

      <KitSection id="buttons" title="Nút" description="Một nút chính mỗi vùng. Nút chính rộng nhất và ở bên phải; hành động phá hủy không nằm trong vùng ngón cái.">
        <Specimen label="Biến thể (size default, 48 px)">
          <Button>Gửi yêu cầu xem phòng</Button>
          <Button variant="outline">Xem hồ sơ chủ trọ</Button>
          <Button variant="secondary">Lưu nháp</Button>
          <Button variant="neutral">Hủy</Button>
          <Button variant="ghost">Xóa tất cả</Button>
          <Button variant="link">Xem thêm</Button>
          <Button variant="destructive">Xóa tin</Button>
          <Button disabled>Đã hết phòng</Button>
        </Specimen>
        <Specimen label="Kích thước">
          <Button size="lg">Tìm phòng</Button>
          <Button>Mặc định</Button>
          <Button size="sm">Nhỏ</Button>
          <Button size="icon" variant="neutral" aria-label="Lưu phòng">
            <Heart aria-hidden="true" />
          </Button>
        </Specimen>
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-brand p-4">
          <p className="w-full text-caption text-brand-muted">Trên dải thương hiệu</p>
          <Button variant="inverse" size="sm" className="h-10">
            Đăng nhập
          </Button>
          <Button variant="ghost-inverse">Cho thuê phòng</Button>
        </div>
      </KitSection>

      <KitSection id="forms" title="Form & tìm kiếm" description="Nhãn luôn hiển thị, lỗi nằm dưới ô và nối bằng aria-describedby. Ô nhập ≥ 16 px để iOS không zoom.">
        <SearchBar />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="kit-phone" label="Số điện thoại" inputMode="tel" defaultValue="0912 345 678" />
          <FormField id="kit-name" label="Họ tên" error="Vui lòng nhập họ tên." />
        </div>
        <Specimen label="Chip lọc: bật/tắt và bỏ lọc">
          <FilterChip icon={Snowflake} selected={chips.includes('dieu_hoa')} onClick={() => toggleChip('dieu_hoa')}>
            Điều hòa
          </FilterChip>
          <FilterChip icon={Wifi} selected={chips.includes('wifi')} onClick={() => toggleChip('wifi')}>
            Wifi miễn phí
          </FilterChip>
          <FilterChip onRemove={() => {}}>Khép kín</FilterChip>
        </Specimen>
      </KitSection>

      <KitSection id="badges" title="Badge & tín hiệu tin cậy" description="Chấm + chữ, không bao giờ chỉ dùng màu. Bấm badge xác minh để xem giải thích.">
        <Specimen label="AvailabilityBadge">
          <AvailabilityBadge vacant={2} total={8} />
          <AvailabilityBadge vacant={0} />
        </Specimen>
        {STATUSES.map(([entity, statuses]) => (
          <Specimen key={entity} label={`StatusBadge · ${entity}`}>
            {statuses.map((status) => (
              <StatusBadge key={status} entity={entity} status={status} />
            ))}
            {entity === 'listing' && (
              <>
                <StatusBadge entity="listing" status="HIDDEN" hiddenBy="OWNER" />
                <StatusBadge entity="listing" status="HIDDEN" hiddenBy="ADMIN" />
              </>
            )}
          </Specimen>
        ))}
        <Specimen label="VerifiedBadge">
          <VerifiedBadge kind="landlord" />
          <VerifiedBadge kind="visit" />
          <VerifiedBadge kind="landlord" iconOnly />
        </Specimen>
        <Specimen label="ScoreBadge: md · sm · chưa có đánh giá">
          <ScoreBadge score={4.6} count={12} />
          <ScoreBadge score={4.1} count={7} size="sm" />
          <ScoreBadge score={0} count={0} />
        </Specimen>
        <TrustNote />
      </KitSection>

      <KitSection id="pricing" title="Giá & chi phí" description="Giá thuê luôn đi cùng chi phí cố định ước tính. Phí bằng 0 hiện “Miễn phí”; tiền cọc tách riêng.">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-6">
            <Specimen label="PriceSummary · card">
              <PriceSummary rent={2_500_000} estimate={2_870_000} />
            </Specimen>
            <Specimen label="PriceSummary · lg">
              <PriceSummary rent={2_500_000} estimate={2_870_000} size="lg" className="w-full" />
            </Specimen>
          </div>
          <CostBreakdown
            rent={2_500_000}
            estimate={2_870_000}
            deposit="1 tháng tiền phòng"
            items={SAMPLE_COST_ITEMS}
            updatedAt="2026-10-10"
          />
        </div>
      </KitSection>

      <KitSection id="cards" title="Thẻ tin đăng" description="Thứ tự: ảnh → giá & ước tính → điểm → tiêu đề → khu vực → khoảng cách → lượt xem & so sánh.">
        <SectionHeader title="SectionHeader" description="Tiêu đề section kèm liên kết bên phải" actionLabel="Xem tất cả" actionTo="/ui-kit#cards" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_LISTINGS.map((listing, index) => (
            <li key={listing.id} className="flex">
              <ListingCard
                listing={listing}
                className="w-full"
                saved={index === 0 ? saved : false}
                onSaveChange={index === 0 ? setSaved : undefined}
                compared={index === 0 ? compared : false}
                onCompareChange={index === 0 ? setCompared : undefined}
              />
            </li>
          ))}
        </ul>
      </KitSection>

      <KitSection id="landlord" title="Chủ trọ" description="Mỗi lần bấm là một lần lưu (UC20); trang cha cập nhật lạc quan kèm toast Hoàn tác.">
        <VacancyStepper value={vacancy} total={4} onChange={setVacancy} />
      </KitSection>

      <KitSection id="feedback" title="Phản hồi">
        <div className="grid gap-4 md:grid-cols-2">
          <Alert className="border-warning/40 bg-warning-bg text-warning">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>2 tin sẽ bị ẩn sau 3 ngày</AlertTitle>
            <AlertDescription className="text-warning">Làm mới tin để tiếp tục hiển thị cho người thuê.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>Không tải được dữ liệu</AlertTitle>
            <AlertDescription>Kiểm tra kết nối mạng rồi thử lại.</AlertDescription>
          </Alert>
        </div>
        <EmptyState
          icon={Heart}
          title="Chưa có phòng nào được lưu"
          description="Bấm biểu tượng trái tim trên tin đăng để lưu lại và so sánh sau."
          action={<Button>Tìm phòng</Button>}
        />
      </KitSection>
    </div>
  );
}
