import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BadgeCheck, Building2, CalendarClock, GraduationCap, ReceiptText, ShieldCheck, Sparkles } from 'lucide-react';
import { useCurrentUser } from '@/auth/session';
import { cn } from '@/lib/utils';
import { formatCount } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { hasRole } from '@/components/layout/navigation';
import { chipClass } from '@/components/kit/styles';
import ListingCard from '@/components/kit/ListingCard';
import MediaPlaceholder from '@/components/kit/MediaPlaceholder';
import SearchBar from '@/components/kit/SearchBar';
import SectionHeader from '@/components/kit/SectionHeader';
import TrustNote from '@/components/kit/TrustNote';
import { AREAS, PROPERTY_TYPES, SAMPLE_LISTINGS, SCHOOL_COUNTS } from '@/data/sampleContent';

const MAX_COMPARE = 3; // BR16

const VALUE_PROPS = [
  {
    icon: ReceiptText,
    title: 'Tổng chi phí, không chỉ giá thuê',
    text: 'Mọi tin đều hiện chi phí cố định ước tính: nước, internet, gửi xe và phí dịch vụ.',
  },
  {
    icon: CalendarClock,
    title: 'Phòng trống được cập nhật',
    text: 'Số phòng còn trống và ngày cập nhật nằm trên từng tin. Tin quá 30 ngày tự ẩn.',
  },
  {
    icon: BadgeCheck,
    title: 'Chủ trọ đã xác minh',
    text: 'HolaNest gọi điện xác minh chủ trọ và duyệt từng tin trước khi hiển thị.',
  },
];

function OfferCard({ eyebrow, title, text, action, icon, tone }) {
  return (
    <article className="flex overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex flex-1 flex-col items-start gap-1 p-4">
        <p className="text-caption text-muted-foreground uppercase">{eyebrow}</p>
        <h3 className="text-h3">{title}</h3>
        <p className="text-body-sm text-muted-foreground">{text}</p>
        <div className="mt-auto pt-3">{action}</div>
      </div>
      <MediaPlaceholder tone={tone} icon={icon} className="hidden w-36 shrink-0 sm:block" />
    </article>
  );
}

// SC01 landing: navy hero, yellow-framed search overlapping its edge, then browse rows (docs/ui-blueprint.md §4.1, §2.5)
export default function Home() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(() => new Set());
  const [compared, setCompared] = useState([]);

  // Save asks for login only when needed, then comes back here (§1.3 principle 5)
  const handleSave = (listing, next) => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    setSaved((current) => {
      const updated = new Set(current);
      next ? updated.add(listing.id) : updated.delete(listing.id);
      return updated;
    });
    toast(next ? 'Đã lưu phòng' : 'Đã bỏ lưu phòng', {
      action: { label: 'Hoàn tác', onClick: () => handleSave(listing, !next) },
    });
  };

  const handleCompare = (listing, checked) => {
    if (!checked) {
      setCompared((ids) => ids.filter((id) => id !== listing.id));
      return;
    }
    if (compared.length >= MAX_COMPARE) {
      toast.error(`Chỉ so sánh tối đa ${MAX_COMPARE} phòng. Bỏ bớt một phòng để thêm phòng này.`);
      return;
    }
    setCompared((ids) => [...ids, listing.id]);
    toast(`Đã thêm vào so sánh (${compared.length + 1}/${MAX_COMPARE})`);
  };

  const isLandlord = hasRole(user, 'LANDLORD');

  return (
    <>
      <section aria-labelledby="hero-title" className="bg-brand text-brand-foreground">
        <div className="page-container pt-6 pb-16 md:pt-8 md:pb-20">
          {user && <p className="text-body-sm font-medium text-highlight">Chào {user.fullName}, sẵn sàng cho học kỳ mới?</p>}
          <h1 id="hero-title" className="mt-1 max-w-3xl text-hero">
            Tìm trọ quanh Hòa Lạc
          </h1>
          <p className="mt-2 max-w-2xl text-lead text-brand-muted">
            Giá thuê luôn đi kèm chi phí cố định ước tính. Phòng còn trống thật, chủ trọ đã xác minh.
          </p>
        </div>
      </section>

      <div className="page-container relative -mt-10 md:-mt-9">
        <SearchBar />
        <div className="mt-4 flex items-center gap-3">
          <p className="hidden shrink-0 text-body-sm font-medium text-muted-foreground sm:block">Khu vực quen gọi</p>
          <ul className="scroll-row -my-1 gap-2 py-1" aria-label="Khu vực quen gọi">
            {AREAS.map((area) => (
              <li key={area.slug}>
                <Link to={`/?khu_vuc=${area.slug}`} className={chipClass(false)}>
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="page-container flex flex-col gap-12 py-10 md:gap-14 md:py-12">
        <section aria-labelledby="offers-title" className="flex flex-col gap-4">
          <SectionHeader
            id="offers-title"
            title="Trước khi đi xem phòng"
            description="Hai điều giúp bạn thuê trọ nhanh hơn và an toàn hơn"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <OfferCard
              eyebrow="Mùa nhập học 2026"
              title="Phòng trống vừa cập nhật quanh ĐH FPT"
              text="Chủ trọ cập nhật số phòng trống ngay trên điện thoại. Lọc 'Chỉ hiện tin còn phòng' để bỏ qua phòng đã kín."
              icon={Sparkles}
              tone={2}
              action={
                <Button asChild size="sm" className="px-4">
                  <Link to="/?truong=fpt&bk=3&con_phong=1">Xem phòng còn trống</Link>
                </Button>
              }
            />
            <OfferCard
              eyebrow="An toàn"
              title="Không chuyển cọc trước khi xem phòng"
              text="Gửi yêu cầu xem phòng qua HolaNest, chọn ngày và khung giờ. Bạn nhận link theo dõi qua email, không cần tài khoản."
              icon={ShieldCheck}
              tone={0}
              action={<TrustNote className="text-caption font-medium" />}
            />
          </div>
        </section>

        <section aria-labelledby="areas-title" className="flex flex-col gap-4">
          <SectionHeader
            id="areas-title"
            title="Khu vực được tìm nhiều"
            description="Các xã quanh Hòa Lạc có nhiều phòng trống nhất tuần này"
          />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
            {AREAS.map((area, index) => (
              <li key={area.slug} className={cn(index < 2 ? 'col-span-2 md:col-span-3' : 'col-span-1 md:col-span-2', index === 4 && 'col-span-2')}>
                <Link to={`/?khu_vuc=${area.slug}`} className="group block overflow-hidden rounded-xl">
                  <MediaPlaceholder
                    tone={area.tone}
                    className={cn('transition-transform group-hover:scale-[1.02]', index < 2 ? 'aspect-16/9' : index === 4 ? 'aspect-16/9 md:aspect-16/11' : 'aspect-4/3 md:aspect-16/11')}
                  >
                    <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-b from-black/45 via-transparent to-black/35 p-4">
                      <div>
                        <p className="text-h1 drop-shadow">{area.name}</p>
                        <p className="text-body-sm font-medium drop-shadow">{area.note}</p>
                      </div>
                      <p className="self-start rounded-sm bg-background/95 px-2 py-0.5 text-caption font-semibold text-foreground">
                        {area.vacancies} phòng trống
                      </p>
                    </div>
                  </MediaPlaceholder>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="schools-title" className="flex flex-col gap-4">
          <SectionHeader id="schools-title" title="Tìm theo trường" description="Khoảng cách tính theo đường chim bay từ cổng trường" />
          <ul className="grid gap-3 sm:grid-cols-3">
            {SCHOOL_COUNTS.map((school) => (
              <li key={school.value}>
                <Link
                  to={`/?truong=${school.value}&bk=3&sx=gan_truong`}
                  className="flex min-h-20 items-center gap-3 rounded-lg border bg-card p-3 transition-shadow hover:shadow-md"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <GraduationCap className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-h3">{school.name}</span>
                    <span className="text-body-sm text-muted-foreground">{formatCount(school.count)} phòng trong 3 km</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="types-title" className="flex flex-col gap-4">
          <SectionHeader id="types-title" title="Tìm theo loại hình" />
          <ul className="scroll-row gap-3 lg:grid lg:grid-cols-4 lg:gap-4 lg:mask-none">
            {PROPERTY_TYPES.map((type) => (
              <li key={type.slug} className="w-60 lg:w-auto">
                <Link to={`/?loai_hinh=${type.slug}`} className="group flex flex-col gap-2">
                  <MediaPlaceholder tone={type.tone} icon={Building2} className="aspect-4/3 rounded-lg" />
                  <span>
                    <span className="block text-h3 group-hover:text-primary">{type.name}</span>
                    <span className="block text-body-sm text-muted-foreground">{formatCount(type.count)} phòng</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="listings-title" className="flex flex-col gap-4">
          <SectionHeader
            id="listings-title"
            title="Được xem nhiều tuần này"
            description="Giá thuê và chi phí cố định ước tính trên mỗi tin"
            actionLabel="Xem tất cả"
            actionTo="/?sx=xem_nhieu"
          />
          <ul className="scroll-row gap-3 lg:grid lg:grid-cols-4 lg:gap-4 lg:mask-none">
            {SAMPLE_LISTINGS.map((listing) => (
              <li key={listing.id} className="flex w-72 lg:w-auto">
                <ListingCard
                  listing={listing}
                  className="w-full"
                  saved={saved.has(listing.id)}
                  onSaveChange={(next) => handleSave(listing, next)}
                  compared={compared.includes(listing.id)}
                  onCompareChange={(checked) => handleCompare(listing, checked)}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section id="vi-sao" aria-labelledby="why-title" className="bg-surface">
        <div className="page-container flex flex-col gap-6 py-10 md:py-12">
          <h2 id="why-title" className="text-display">
            Vì sao thuê trọ qua HolaNest
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {VALUE_PROPS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-h3">{title}</h3>
                  <p className="mt-1 text-body-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="landlord-title" className="page-container py-10 md:py-12">
        <div className="flex flex-col items-start gap-4 rounded-xl bg-brand p-6 text-brand-foreground md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-2xl">
            <h2 id="landlord-title" className="text-display">
              Bạn có phòng cho thuê quanh Hòa Lạc?
            </h2>
            <p className="mt-2 text-brand-muted">
              Đăng tin miễn phí. Cập nhật phòng trống chỉ với hai chạm, khỏi nghe điện thoại hỏi “còn phòng không” cả ngày.
            </p>
          </div>
          <Button asChild variant="inverse" size="lg" className="shrink-0">
            <Link to={isLandlord ? '/landlord' : '/become-landlord'}>{isLandlord ? 'Vào Kênh chủ trọ' : 'Đăng tin cho thuê'}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
