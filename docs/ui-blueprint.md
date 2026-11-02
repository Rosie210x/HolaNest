# Hola Nest — UI/UX Master Blueprint

## 1. UX design principles & strategy

Every renter screen must answer three questions within the first screen on a 360 px phone: how much will this room really cost per month, how far is it from campus, and is it really still available. Everything else in this blueprint serves that, plus a two-tap landlord loop that keeps vacancy data fresh. Scope follows SRS HN01 v01; anything beyond it is marked *(enhancement)*.

### 1.1 Personas

Personas are working hypotheses built from SRS §1.1–1.2; validate them in the first 5–8 user interviews before sprint 2.

| Persona | Context | Primary question | Device | What must be visible |
| --- | --- | --- | --- | --- |
| Fresher (FPT / ĐHQG Hòa Lạc) | First rental, peak demand Aug–Sep and each semester start, often decides with parents | “Phòng này tổng cộng bao nhiêu một tháng, có lừa đảo không?” | Phone, Zalo-native | Fixed cost estimate, verified badge, anti-deposit warning, share to Zalo |
| Pair of students splitting a room | Comparing 2–3 shortlisted rooms, cost depends on headcount and bikes | “Ở 2 người, 1 xe máy thì phòng nào rẻ nhất?” | Phone, laptop for comparing | Compare matrix, per-person water, parking, AI assistant |
| Young worker (Khu CNC Hòa Lạc) | Has a motorbike and income, values autonomy | “Có chỗ để xe, giờ giấc tự do, không chung chủ không?” | Phone | Amenity filters, distance, chung cư mini filter |
| Landlord (household-run nhà trọ) | Low web literacy, answers the same questions by phone all day | “Cập nhật số phòng trống cho nhanh” | Phone only | Big vacancy stepper, one-tap refresh, new-request badge |
| Admin (ops team) | Works queues, 24 h moderation target (BR10) | “Hôm nay còn gì phải xử lý?” | Desktop | Pending-work tiles with age, filtered queues, mandatory reasons |

### 1.2 Journey: Facebook groups vs Hola Nest

| Stage | Today (Facebook groups, word of mouth) | Hola Nest answer | Screen · rule |
| --- | --- | --- | --- |
| Discover | Scroll many groups, no filters | Keyword (diacritic-insensitive) + school radius + amenities, state kept in URL | SC01 · BR13, BR14 |
| Judge cost | Post says “2tr8”, fees hidden | Rent and fixed monthly estimate side by side on every card | SC01, SC02 · BR06, BR07 |
| Check availability | Old posts never removed | “Còn N phòng” + update date on every card; auto-hide after 30 days | SC01 · BR05, BR11 |
| Trust | Fake posts, deposit demanded before viewing | Phone-verified landlords, pre-moderated listings, visit-gated reviews, anti-deposit note | SC02, SC03 · BR22, BR26 |
| Compare | Screenshots and memory | Side-by-side matrix (max 3) + AI grounded in the matrix | SC11 · BR16, BR17 |
| Book a visit | Phone tag | Viewing request with slot, email tracking link, no account needed | SC04, SC05 · BR18–BR20 |
| After the visit | Nothing captured | Review unlocked, “Đã thuê” feeds referral verification | SC12, SC28 · BR22, BR28 |

### 1.3 Principles (each one is testable)

1. **Total cost beside rent, always.** No surface shows rent alone. Cards, detail, compare and landlord form all pair rent with “Chi phí cố định ước tính” computed by BR07, always labelled “ước tính”.
2. **Freshness is a trust signal.** Availability count and update date sit on every card; stale data has a visible consequence (auto-hide).
3. **Thumb-first on mobile.** Primary actions live in the bottom 1/3 of a 360 × 640 viewport (sticky action bar, filter sheet CTA, compare tray).
4. **Explain every badge.** Tapping “Đã xác minh” or “Đã đi xem phòng” opens a one-line explanation of what was checked.
5. **Ask for login only when needed, then resume.** Guests can search, view and send a viewing request (UC08). Save, compare and AI ask for login and complete the original action afterwards (UC10 exception).
6. **Landlord tasks in two taps.** Vacancy and refresh are applied from the list, no form, no re-approval (UC20, BR10).
7. **Admin works queues, not pages.** Oldest first, age visible, every reject/hide/lock needs a reason (SRS §5.2).
8. **AI assists, never blocks.** The comparison table works fully when the assistant is off, out of quota or failing (UC11 AC).

## 2. Design system & tokens

The system is a shadcn/ui theme on Tailwind CSS: deep teal as the brand, and three separate hues so “brand”, “available” and “verified” never mean the same colour. All tokens are CSS variables on `:root` with a `.dark` override, so dark mode is a token swap, not a redesign.

### 2.1 Colour tokens

Contrast ratios are against the background each token is used on (white unless noted); all text pairs meet WCAG AA 4.5:1.

| Token | Light | Dark | Use | Contrast (light) |
| --- | --- | --- | --- | --- |
| `--primary` | #0F766E (teal-700) | #2DD4BF (teal-400) | Primary buttons, links, active tab, focus ring | 5.5:1 |
| `--primary-foreground` | #FFFFFF | #042F2E | Text on primary | 5.5:1 |
| `--background` | #FFFFFF | #0B1220 | Page | — |
| `--surface` | #F8FAFC (slate-50) | #111827 | Section bands, cost table header, sidebar | — |
| `--foreground` | #0F172A (slate-900) | #E2E8F0 | Body text, prices | 17.9:1 |
| `--muted-foreground` | #475569 (slate-600) | #94A3B8 | Meta: views, dates, “đường chim bay” | 7.6:1 |
| `--border` | #E2E8F0 (slate-200) | #1F2937 | Card and input borders (inputs use slate-400 #94A3B8 for 3:1 non-text contrast) | — |
| `--available` / `-bg` | #15803D on #F0FDF4 | #4ADE80 on #052E16 | “Còn N phòng” badge | 4.8:1 |
| `--unavailable` / `-bg` | #475569 on #F1F5F9 | #CBD5E1 on #1E293B | “Hết phòng” — neutral, not red: it is a state, not an error | 6.9:1 |
| `--verified` | #1D4ED8 (blue-700) | #60A5FA | “Đã xác minh” landlord badge, “Đã đi xem phòng” review badge | 6.7:1 |
| `--warning` / `-bg` | #92400E on #FFFBEB | #FCD34D on #422006 | Chờ duyệt, sắp hết hạn, SLA > 24 h | 7.0:1 |
| `--destructive` | #B91C1C (red-700) | #F87171 | Errors, Từ chối, Khóa, Xóa | 6.5:1 |
| `--best` / `-bg` | #115E59 on #F0FDFA | #5EEAD4 on #042F2E | Best value per row in SC11, always with a “Tốt nhất” chip | 7.4:1 |
| `--ai` | #6D28D9 (violet-700) | #A78BFA | AI assistant icon, panel accent only (never for data) | 7.1:1 |

### 2.2 Status → token mapping

One badge component (`StatusBadge`) renders every status: dot + text label, never colour alone.

| Entity | Status (DB) | Label | Token |
| --- | --- | --- | --- |
| Listing | DRAFT | Nháp | neutral |
| Listing | PENDING | Chờ duyệt | warning |
| Listing | APPROVED | Đang hiển thị | available |
| Listing | REJECTED | Bị từ chối | destructive |
| Listing | HIDDEN (OWNER / ADMIN / EXPIRED) | Đã ẩn · Chủ trọ ẩn / Admin ẩn / Quá hạn | neutral; ADMIN adds destructive outline |
| Viewing request | PENDING | Chờ xác nhận | warning |
| Viewing request | CONFIRMED | Đã xác nhận | verified |
| Viewing request | REJECTED | Từ chối | destructive |
| Viewing request | CANCELLED · EXPIRED · NO\_SHOW | Đã hủy · Hết hạn · Không đến | neutral |
| Viewing request | VIEWED | Đã xem | available |
| Viewing request | RENTED | Đã thuê | primary (solid) |
| Landlord profile | PENDING · APPROVED · REJECTED | Chờ duyệt · Đã duyệt · Bị từ chối | warning · available · destructive |

### 2.3 Typography

Font: **Be Vietnam Pro** (Google Fonts, designed for Vietnamese stacked diacritics), weights 400/500/600/700, fallback `"Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Prices use `font-variant-numeric: tabular-nums` so columns align in the compare table.

| Token | Size / line height (mobile → ≥768) | Weight | Use |
| --- | --- | --- | --- |
| `display` | 24/32 → 30/38 | 700 | Page title (“Tìm trọ quanh Hòa Lạc”) |
| `h1` | 22/30 → 28/36 | 700 | Listing title on SC02 |
| `h2` | 18/26 → 20/28 | 600 | Section headings (Giá & chi phí, Tiện ích) |
| `h3` | 16/24 | 600 | Card title, table group header |
| `body` | 16/24 | 400 | Default text; never below 16 px in inputs (prevents iOS zoom) |
| `body-sm` | 14/20 | 400 | Card meta, table cells |
| `caption` | 12/16 | 500 | Timestamps, helper text; never for prices or status |
| `price-lg` | 28/32 | 700 | Rent on SC02 / right rail |
| `price-card` | 20/28 | 700 | Rent on cards (“2,5 triệu/tháng”) |

Rules: heading line height stays ≥ 1.25 so “Ở”, “Ắ” do not clip; titles clamp at 2 lines; money uses `Intl.NumberFormat('vi-VN')` → “2.500.000 đ”, shortened on cards to “2,5 triệu/tháng” (SRS §5.2).

### 2.4 Spacing, radius, elevation, motion

- **Spacing:** 4 px base; scale 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64. Card padding 12 (mobile) / 16; section gap 24 / 32; page gutter 16 / 24.
- **Radius:** `sm` 6 (chips, badges) · `md` 8 (inputs, buttons) · `lg` 12 (cards, cost card) · `xl` 16 (dialogs, bottom sheets, top corners only) · `full` (pills, avatars).
- **Elevation:** `shadow-sm` card hover (desktop only) · `shadow-md` sticky action bar, compare tray, sticky table header · `shadow-lg` dialog, popover. Flat borders elsewhere.
- **Z-index:** header 40 · sticky bars and compare tray 50 · sheet / dialog 60 · toast 70.
- **Motion:** 150 ms ease-out for state changes (save heart, stepper), 250 ms for sheets; honour `prefers-reduced-motion` by disabling transforms. Skeleton shimmer 1.5 s.
- **Icons:** lucide-react (shadcn default), 20 px inline, 24 px in navigation, stroke 1.75.

```css
:root {
  --primary: 174 77% 26%;      /* #0F766E */
  --available: 142 72% 29%;    /* #15803D */
  --verified: 224 76% 48%;     /* #1D4ED8 */
  --warning: 26 83% 31%;       /* #92400E */
  --destructive: 0 74% 42%;    /* #B91C1C */
  --radius: 0.5rem;
}
.dark { --primary: 172 66% 50%; /* #2DD4BF */ }
```

## 3. Global layout & responsive framework

Design at 360 px first, then add columns at 640, 1024 and 1280; the three role shells (renter, landlord, admin) share tokens and components but not navigation.

### 3.1 Breakpoints and grid

| Breakpoint | Width | Columns · gutter · margin | Renter listing grid | Landlord / admin shell |
| --- | --- | --- | --- | --- |
| base | 360–639 px | 4 · 16 · 16 | 1 card per row, filters in bottom sheet | Bottom tab bar, list → detail pages |
| `sm` | 640–767 px | 8 · 16 · 24 | 2 cards | Bottom tab bar |
| `md` | 768–1023 px | 8 · 24 · 24 | 2 cards, filters still in sheet | Collapsed icon rail (72 px) |
| `lg` | 1024–1279 px | 12 · 24 · 32 | Filter sidebar 280 px + 2 cards | Sidebar 240 px + content |
| `xl` | ≥ 1280 px | 12 · 24 · auto | Filter sidebar 280 px + 3 cards (matches SC01 mockup) | Sidebar 240 px + content, master–detail panes |

Container: renter pages max-width 1200 px centred; landlord/admin content max-width 1440 px. Nothing may scroll horizontally at 360 px except the compare matrix and chip rows, which scroll on purpose with snap points and a visible edge fade.

### 3.2 Navigation per role

| Role | Mobile (< 768 px) | Desktop (≥ 1024 px) |
| --- | --- | --- |
| Guest / renter | Top bar 56 px: logo, search pill, avatar or “Đăng nhập”. Bottom tab bar 56 px + safe area: **Tìm phòng · Đã lưu · Yêu cầu · Tài khoản** (badge on Yêu cầu when a request changes status). Guests see the same tabs; tapping Đã lưu prompts login. | Top nav: Tìm phòng · Phòng đã lưu · Yêu cầu xem phòng, right side “Cho thuê phòng” (→ SC15) or “Kênh chủ trọ” (→ SC16), notification bell, account menu. |
| Landlord | Separate “Kênh chủ trọ” shell. Bottom tabs: **Tổng quan · Yêu cầu (badge) · Thống kê · Tài khoản**; floating “+ Thêm” button bottom-right, 56 px, above the tab bar. Link “Về trang tìm phòng” in Tài khoản. | Left sidebar (as in mockups): Tổng quan, Yêu cầu xem phòng (count), Thống kê tin đăng, Hồ sơ công khai, Tài khoản; footer shows name + “Chủ trọ đã xác minh”. |
| Admin | Usable at 360 px (NFR01) but optimised for desktop: hamburger opens a sheet with the same sidebar. Tables reflow to stacked cards. | Left sidebar with live counters per queue: Dashboard, Hồ sơ chủ trọ, Kiểm duyệt tin, Đánh giá & báo cáo, Giới thiệu thành công, Tin đăng hộ, Người dùng, Danh mục. |

Reserve one nav slot in the renter shell for post-MVP modules (roommate, pass phòng, chợ đồ cũ, out of scope per SRS §1.5.3) so adding them later does not reshuffle tabs users have learned.

### 3.3 Thumb zone and bottom stacking

On a 360 × 640 viewport, the bottom 200 px is the comfortable one-handed zone. Rules:

1. **Max two fixed layers at the bottom.** SC01: tab bar (56) + compare tray when ≥ 1 listing is selected (56). SC02: tab bar hidden, replaced by the sticky action bar (64 + safe area); compare count moves to a header icon.
2. **Primary CTA is the widest, rightmost control** in the action bar (“Gửi yêu cầu xem phòng”); secondary actions (Gọi, Zalo) are 48 × 48 icon-plus-label buttons on the left.
3. **Sheets put their confirm button at the bottom**, sticky: filter sheet “Xem 24 phòng”, viewing request “Gửi yêu cầu”, report “Gửi báo cáo”.
4. **Content padding-bottom = height of fixed layers + 16 px** so the last card or form field is never hidden; use `env(safe-area-inset-bottom)` on iOS.
5. **Destructive actions never sit in the thumb zone** (Xóa, Hủy yêu cầu live in overflow menus or require a confirm dialog per SRS §5.2).

### 3.4 URL as state

Search state lives in the query string (UC05 step 5) so links shared in Zalo reproduce the exact result: `/?q=hoa+lac&truong=fpt&bk=3&gia=1500000-3500000&khu_vuc=thach-hoa&tien_ich=khep_kin,dieu_hoa&con_phong=1&sx=gan_truong&trang=2`. Sort `gan_truong` is dropped server-side when `truong` is absent (BR14). Public routes: `/rooms/{id}`, `/landlords/{id}` (SRS §5.2), served with Open Graph HTML by Spring Boot (NFR07).

## 4. Key screen layouts & component architecture

Each screen below lists its zones top to bottom with mobile and desktop behaviour, the shadcn/ui primitives behind them, and the SRS rule each zone enforces. States (loading, empty, error) are summarised per screen and catalogued in section 6.

### 4.1 SC01 — Trang chủ / Tìm kiếm phòng

| Zone | Mobile (360) | Desktop (≥ 1280) | Components | Rules |
| --- | --- | --- | --- | --- |
| Hero search | Search input full width; below it School `Select` + radius `ToggleGroup` (≤ 1 · 2 · 3 · 5 km) on one row; “Khu vực quen gọi” chips scroll horizontally | One row: search input (flex) · school select · radius select · “Tìm phòng” button | `Input`, `Select`, `ToggleGroup`, `Badge` as chips | BR13 keyword ≥ 2 chars, 300 ms debounce; BR14 radius values |
| Filter entry | Sticky row under the top bar: “Bộ lọc (3)” button + active filter chips (removable ×) + sort button | Left sidebar 280 px, sticky, “Xóa tất cả” link | `Sheet` (bottom, 90 vh), `Accordion` groups, `Slider` + two `Input` for price, `Checkbox`, `Switch` “Chỉ hiện tin còn phòng” | Amenities combine with AND (BR14) |
| Filter sheet footer | Sticky: “Xóa tất cả” (ghost) · “Xem 24 phòng” (primary, live count) | — (filters apply instantly) | `Button` | Count from a lightweight count endpoint, debounced 400 ms |
| Result header | “24 phòng phù hợp” + sort `Select` | Same, plus active chips row | `Select` | “Gần trường nhất” disabled with tooltip until a school is chosen (BR14) |
| Listing grid | 1 card per row | 3 cards per row | `ListingCard` (below) | 20 per page (BR14), only APPROVED listings (UC05) |
| Pagination | “Trang trước · 2/5 · Trang sau” | Numbered `Pagination` | `Pagination` | Page in URL (`trang=`) |
| Compare tray | Fixed above tab bar: thumbnails (max 3) + “So sánh (2)” | Fixed bottom-centre pill, 560 px wide (as in mockup) | `CompareTray` | BR16: 2–3 listings, stored in `localStorage` |

**ListingCard anatomy** (top to bottom; order is deliberate — cost before title):

1. Image 4:3 thumbnail; top-left availability badge (“Còn 2 phòng” / “Hết phòng”); top-right save heart (44 × 44 hit area on a 32 px circle); bottom-left photo count.
2. **Rent** in `price-card` (“2,5 triệu/tháng”) + rating “★ 4,6 (12)” right-aligned.
3. **“Chi phí cố định ước tính 2,87 triệu”** in `body-sm`, foreground colour, not muted.
4. Title, 2-line clamp, `h3`.
5. Property name · khu vực.
6. Distance: “0,8 km tới ĐH FPT · đường chim bay” (selected school; nearest school if none selected).
7. Meta row: “1.284 lượt xem · Cập nhật 10/10” + “So sánh” checkbox (whole label is the 48 px target).

“Hết phòng” cards stay in results (unless the switch is on) with the image at 60 % opacity and the badge neutral; they can still be saved and compared.

States: 6 card skeletons on first load; on refetch, keep old results at 60 % opacity with a 2 px top progress bar (no layout jump); empty = MSG27 with one button per active filter (“Bỏ ‘Điều hòa’”); error = MSG29 + “Thử lại”.

### 4.2 SC02 — Chi tiết phòng

| Zone | Mobile (360) | Desktop (≥ 1024) | Components | Rules |
| --- | --- | --- | --- | --- |
| App bar | Back · Chia sẻ · Lưu; overflow menu holds So sánh, Báo cáo. After scrolling past the price, a slim bar shows “2.500.000 đ · ước tính 2.870.000 đ” | Breadcrumb left; Chia sẻ · Lưu · So sánh · Báo cáo right | `DropdownMenu`, `Button` | UC09, UC10, UC15 |
| Gallery | Full-bleed swipe carousel 4:3, counter “1/8”, “Video” chip | 1 large + 4 small grid, last tile “+4 ảnh” | `Carousel`, `Dialog` lightbox, `AspectRatio` | BR15: 3–10 photos, first is cover; video embed from link |
| Title block | Chips (Nhà trọ · Phòng đơn · Còn 2/8 phòng), H1, address, “1.284 lượt xem · 98 lượt lưu · Cập nhật 10/10/2026” | Same, left column 8/12 | `Badge` | BR25 counters |
| Key facts | 2 × 2 tiles: Diện tích · Sức chứa · Loại phòng · Loại hình | 4 tiles in a row | `Card` | — |
| Cost card | See §5.1; first screen on mobile | Left column; summary repeated in right rail | `CostBreakdown` | BR06, BR07 |
| Amenities | 2-column icon list; amenities not offered shown muted with “Không có” for screen readers | 3 columns | `AmenityList` | Grouped PHONG / NHA / QUY\_DINH |
| Description | Collapsed to 6 lines + “Xem thêm” | Full | `Collapsible` | Text escaped (NFR05) |
| Location | Address + “Mở Google Maps” button; distance tile per school, “đường chim bay” footnote | Same | `Button` (external link) | BR12: 0,1 km rounding |
| Reviews | Average + count, 2 latest, “Xem tất cả 12 đánh giá” | Same | `ReviewItem` with “Đã đi xem phòng” badge | BR22, BR23 |
| Landlord card | Name, verified badge, rating, join date, “Xem hồ sơ chủ trọ” | In right rail | `Avatar`, `VerifiedBadge` | UC07 |
| Action area | **Sticky bottom bar**: Gọi · Zalo · “Gửi yêu cầu xem phòng” | **Sticky right rail** (top: 88 px, 4/12): price, estimate, availability, primary CTA, Gọi/Zalo, anti-deposit note, landlord mini card | `StickyActionBar`, `Card` | BR05: CTA disabled as “Đã hết phòng” when vacancy = 0; contact still works |

Contact clicks are logged with `navigator.sendBeacon` before opening `tel:` / `zalo.me` so the count survives navigation (BR25). Not-found / hidden listing: “Tin không còn hiển thị” page with 4 listings from the same khu vực (UC06).

&#91;embedded content: SC02 mobile anatomy · 360 px · 7 zones, 2 sticky\]

The cost card and the action bar are the two accented zones: the first must land in the opening screen, the second never leaves the thumb zone.

### 4.3 SC11 — So sánh phòng & Trợ lý AI

| Zone | Mobile (360) | Tablet / small desktop (768–1279) | Large desktop (≥ 1280) |
| --- | --- | --- | --- |
| Header | “So sánh phòng · 3/3” + school select for the distance row | Same + “Hỏi trợ lý AI” button | Same; AI panel already open |
| Matrix | Sticky label column 112 px + listing columns 160 px each, horizontal scroll with snap; groups collapsible | Full matrix, no scroll for 3 columns | Matrix 8/12 width |
| AI assistant | Floating “Hỏi AI” button → bottom `Drawer` 85 vh; a “Xem bảng” handle collapses it to 30 vh so rows stay visible | Right `Sheet` 400 px overlaying the matrix edge | Docked panel 4/12 (min 380 px), scrolls independently, matrix stays visible |

Matrix row groups (from UC11 step 3): **Chi phí hằng tháng** (Giá thuê, Chi phí cố định ước tính, Tiền cọc, Điện, Nước, Internet, Gửi xe, Phí dịch vụ chung) · **Phòng** (Diện tích, Loại phòng · sức chứa, Loại hình) · **Vị trí** (Khu vực, Khoảng cách tới trường đã chọn) · **Tiện ích** (✓ / —) · **Độ tin cậy & tình trạng** (Điểm đánh giá, Tình trạng trống, Ngày cập nhật). Interaction rules are in §5.2 and §5.3.

### 4.4 SC16 — Tổng quan chủ trọ

The SC16 mockup in the SRS duplicates the SC18 photo screen (comment \[10\]); this is the intended layout.

| Zone | Mobile (360) | Desktop | Components | Rules |
| --- | --- | --- | --- | --- |
| KPI strip | 2 × 2 tiles: Yêu cầu mới · Đang hiển thị · Sắp hết hạn (warning) · Chờ duyệt; each tile links to its filtered view | 4 tiles in one row | `Card` | — |
| Expiry banner | “2 tin sẽ bị ẩn sau 3 ngày nếu không được làm mới” + “Xem” | Same | `Alert` (warning) | BR11, MSG25 |
| Status tabs | Scrollable tabs: Tất cả · Đang hiển thị · Chờ duyệt · Nháp · Bị từ chối · Đã ẩn (counts) | Same | `Tabs` | BR08 |
| Property group | Card per nhà trọ: name, address, coordinate status (“Chưa có tọa độ” warning), “Sửa”, “+ Thêm tin” | Same, 2 columns at ≥ 1280 | `Card`, `Collapsible` | UC17, BR12 |
| Listing row | Thumbnail 64 · title · `StatusBadge` · rent; **vacancy stepper** “Phòng trống \[−\] 2/4 \[+\]” with 48 px buttons; **“Làm mới”** button with “còn 4 ngày” hint; overflow: Sửa, Ẩn/Hiện, Thống kê, Xóa | Table row with same controls inline | `VacancyStepper`, `Button`, `DropdownMenu` | UC20, BR05, BR10, BR11 |
| Add | Floating “+ Thêm” (Nhà trọ / Tin đăng) | Primary button in header | `Button`, `DropdownMenu` | UC17, UC18 |

The two-tap target (UC20 AC) is met because one stepper tap commits the new vacancy: optimistic update, toast “Đã cập nhật số phòng trống · Hoàn tác” (5 s undo), rollback + MSG29 on failure. Vacancy 0 instantly flips the public badge to “Hết phòng”. ADMIN-hidden listings show the reason and a disabled “Làm mới” (UC20 exception). Empty state: three-step onboarding card (Thêm nhà trọ → Thêm tin → Gửi duyệt).

### 4.5 SC21 — Admin Dashboard

| Row | Content | Components | Rules |
| --- | --- | --- | --- |
| Header | “Dashboard” + month picker + “Cập nhật lúc 13:00 · trễ tối đa 1 giờ” | `Popover` + `Calendar` | UC30 AC: data lag ≤ 1 h |
| Pending work (5 tiles) | Hồ sơ chủ trọ · Tin chờ duyệt · Báo cáo mới · Đã thuê chờ xác minh · Email lỗi. Each: count, “Cũ nhất: 2 ngày”, warning tint when oldest > 24 h; click opens the queue pre-filtered | `Card` as link | UC30 AC; BR10 24 h target; UC31 failed emails |
| KPIs (4) | Người dùng · Chủ trọ đã duyệt · Tin đang hiển thị · Yêu cầu tháng này, each with change vs last period | `Card` | — |
| Charts row 1 | Yêu cầu xem phòng theo tuần (bars, last 8 weeks) · Tin theo trạng thái (horizontal bars) | shadcn `Chart` (Recharts) | BR08, BR20 |
| Charts row 2 | Giới thiệu thành công & hoa hồng theo tháng (bars + collected vs recorded) · Trợ lý AI (questions, error rate, spend vs monthly budget progress bar, on/off status) | `Chart`, `Progress` | BR28, NFR12 |

Layout: 12-column grid; tiles span 12/5 (wrap to 3 + 2 at 1024–1279), KPIs 3 each, charts 6 each; below 1024 everything stacks.

### 4.6 Supporting screens (brief)

- **SC04 Gửi yêu cầu xem phòng:** full-screen `Sheet` on mobile, `Dialog` 560 px on desktop. Fields in order: Họ tên, SĐT (`inputmode=tel`), Email, Số người (stepper 1–6), Ngày xem (calendar limited to today … +14 days, BR18), Khung giờ (`ToggleGroup`: Sáng 8–11h · Chiều 14–17h · Tối 18–20h), Ghi chú (300 chars). CAPTCHA only for guests (BR19). Logged-in users get fields prefilled. Listing summary at top so users know which room they are booking.
- **SC18 Thêm / sửa tin đăng:** sectioned form (Thông tin phòng · Giá & chi phí · Tiện ích · Mô tả · Ảnh & video). Desktop: sticky right column with live “Chi phí cố định ước tính” and the “Điều kiện gửi duyệt” checklist (BR09). Mobile: the estimate is a collapsible sticky footer above “Lưu nháp / Gửi duyệt”. Fields that trigger re-approval (title, description, photos, video) carry a small “Cần duyệt lại” tag so MSG21 is never a surprise (BR10).
- **SC19 Yêu cầu xem phòng (chủ trọ):** master–detail on desktop (list 5/12, detail 7/12); list → detail page on mobile. Detail shows a status timeline from `viewing_request_logs`, and only the valid next actions for the current status and date (Bảng 3).

## 5. Interaction design & UX case study references

Four patterns carry Hola Nest’s differentiation (SRS §1.4); each adapts a proven pattern from a mature product to a rule in the SRS.

### 5.1 Transparent cost breakdown (SC02, SC18, SC11)

**Reference:** Airbnb’s move to showing the total price up front, and Booking.com’s itemised price breakdown, both responded to the same complaint Hòa Lạc renters have: the headline price is not what you pay.

**Pattern — two tiers, then line items:**

1. **Tier 1, side by side:** “Giá thuê 2.500.000 đ/tháng” | “Chi phí cố định ước tính **2.870.000 đ**/tháng”, the estimate visually equal or stronger (it is the number renters actually budget with).
2. **Formula line** under tier 1, muted: “Giá thuê + internet + phí dịch vụ + gửi xe (1 xe) + nước (1 người). Chưa gồm tiền điện.” The wording changes when water is per m³: “Chưa gồm tiền điện và nước theo m³.” (BR07)
3. **Line items table:** Tiền cọc · Điện · Nước · Internet · Gửi xe · Phí dịch vụ chung, each with value + unit + landlord note (“Theo công tơ riêng”, “Wifi chung tầng”). A 0 value renders as **“Miễn phí”**, never “0 đ”. “Theo giá nhà nước” renders as text with an info tooltip.
4. **Deposit is shown but excluded** from the monthly estimate, with its own row (“1 tháng tiền phòng”) because it hits cash flow once.
5. Header right: “Chủ trọ khai báo, cập nhật 10/10/2026” — attribution plus freshness.

**SC18 mirror:** the landlord sees the same card computed live as they type, so the number renters will see is never a surprise. *(Enhancement, post-MVP)*: a “Ước tính cho tôi” control on SC02 (số người, số xe) — BR07 fixes the estimate at 1 person / 1 bike, so this needs a product decision first.

### 5.2 Comparison matrix (SC11)

**References:** GSMArena / Apple model comparison (fixed spec rows, sticky product headers) and Best Buy’s “show only differences” toggle.

| Rule | Behaviour | Source |
| --- | --- | --- |
| Entry | “So sánh” on card or detail adds to the tray; 4th add shows toast MSG09 and does nothing | BR16 |
| Guest | Guests can fill the tray (it is in `localStorage`); opening SC11 asks for login, then returns with the tray intact | BR16, UC11 |
| Too few | Opening with 1 listing shows MSG10 and an empty column “+ Thêm phòng” that opens a picker of saved listings (SC10) | UC11 |
| Sticky header | Row with thumbnail, 2-line name, remove × stays pinned while scrolling 20+ rows | — |
| Sticky labels | First column pinned during horizontal scroll on mobile | — |
| Best value | Per row: min for every cost row and deposit, max for area and rating, min distance, “Còn phòng” over “Hết phòng”. Ties highlight all; non-comparable values (“Theo giá nhà nước”, mixed water units) highlight none | UC11 step 3 |
| Highlight style | `--best-bg` fill + “Tốt nhất” chip; never colour alone (WCAG 1.4.1) | — |
| Show differences | `Switch` “Chỉ hiện điểm khác nhau” hides rows where all values match (e.g. every room has nóng lạnh) | *(enhancement)* |
| Stale items | A listing hidden since it was added shows “Không còn hiển thị” and greys its column | UC11 exception |
| Data parity | Every value comes from the same API fields as SC02; no recomputation client-side | UC11 AC |

### 5.3 AI assistant panel (SC11, UC12)

**References:** chat-beside-content layouts (Notion AI side panel, Perplexity’s streamed answers): the answer streams next to the source it reasons over, so users can verify without switching views.

- **Header:** “Trợ lý so sánh phòng” + subtitle “Chỉ dựa trên dữ liệu 3 phòng đang so sánh” + quota chip “Còn 17/20 câu hôm nay” (BR17).
- **Privacy note** (first open only): “Số điện thoại, email của chủ trọ và bạn không được gửi cho AI.” (BR30, NFR06)
- **Suggested prompts** (chips, tap to send): “Phòng nào rẻ nhất nếu ở 2 người và có 1 xe máy?”, “Phòng nào gần ĐH FPT nhất?”, “Tổng tiền tháng đầu gồm cả cọc là bao nhiêu?”.
- **Input:** textarea, 500-char counter, Enter sends / Shift+Enter newline on desktop, send button 48 px.
- **Streaming states:** sent → three-dot indicator → tokens render as they arrive (SSE) with a “Dừng” button → done shows a muted footer “AI có thể nhầm, hãy đối chiếu bảng bên cạnh”. No first token in 5 s keeps the indicator; at 30 s the request aborts and MSG11 appears inline with “Thử lại” (NFR04).
- **Answer format:** short paragraphs and small markdown tables allowed; rendered through a sanitiser (no raw HTML).
- **Cross-reference** *(enhancement)*: listing names in the answer render as chips; hovering or tapping one highlights that column in the matrix. Requires the backend to return listing ids alongside text.
- **Failure modes:** flag off → panel and button not rendered at all (UC12); quota used → input disabled with MSG12; LLM error → MSG11; in every case the matrix keeps working.
- **Session memory:** last 5 Q&A pairs are sent as context (UC12 step 2); a “Cuộc hội thoại mới” action clears them.

### 5.4 Trust signalling

**Reference:** Airbnb’s identity-verified and “stayed here” review markers; marketplaces that show freshness (“updated 2 days ago”) as a credibility cue.

| Signal | Where | Rule | Visual |
| --- | --- | --- | --- |
| Landlord verified | Landlord card (SC02), SC03 header, listing cards (icon only) | Admin phone-verified; removed when contact phone changes until re-verified (BR26) | Blue badge-check icon + “Đã xác minh”; tap → “HolaNest đã gọi điện xác minh số điện thoại của chủ trọ” |
| Moderated listing | Footer of cost card | Every public listing passed review (BR08) | Muted line “Tin đã được HolaNest kiểm duyệt” |
| Freshness | Cards, SC02 title block, SC10 | Relative date under 7 days (“2 ngày trước”), else dd/MM/yyyy; auto-hide at 30 days (BR11) | Clock icon + text |
| Verified visit review | Each review | Only VIEWED / RENTED requests can review (BR22) | Blue chip “Đã đi xem phòng” |
| Rating with count | Cards, SC02, SC03 | Never a star without its count; 0 reviews → “Chưa có đánh giá” (BR23) | ★ 4,6 (12) |
| Anti-deposit warning | Right rail / above action bar, SC04 confirmation | Static copy | Shield icon + “HolaNest không thu tiền cọc. Đừng chuyển khoản cho ai trước khi xem phòng.” |
| Report | SC02 overflow / header | One open report per user per listing (BR24) | Flag icon “Báo cáo” |

### 5.5 Viewing request lifecycle (SC04 → SC05 / SC12 → SC19)

**Reference:** delivery and booking trackers (status stepper with the next expected step), which cut “has the landlord seen my request?” calls.

- **Confirmation (MSG13)** shows the request code (YC-7Q2M4K), the slot, and “Chúng tôi đã gửi link theo dõi tới email của bạn”.
- **Tracker (SC05 / SC12 card):** vertical stepper Đã gửi → Chủ trọ xác nhận → Ngày xem → Báo kết quả, timestamps from `viewing_request_logs`; terminal states (Từ chối, Đã hủy, Hết hạn) end the stepper with their reason.
- **Actions appear only when valid** (Bảng 3): Hủy before the viewing date; “Tôi đã đi xem” / “Tôi đã thuê phòng này” from the viewing date on. The cancel cutoff is shown in words (“Có thể hủy đến hết ngày 13/10”).
- **After “Đã thuê” or “Đã xem”:** an inline prompt “Viết đánh giá” opens SC13 (UC13).

## 6. Accessibility & implementation guidelines

Ship to WCAG 2.2 AA (NFR13 asks for AA contrast; the rest is the cheap way to get there), with 48 × 48 px touch targets as the house rule — stricter than AA’s 24 px because the core users browse one-handed on budget Android phones.

### 6.1 Accessibility checklist

- **Touch targets:** every interactive element ≥ 48 × 48 px (icon buttons pad a 20–24 px icon), ≥ 8 px between adjacent targets. Checkbox and radio rows make the whole row the target.
- **Contrast:** text pairs in §2.1 are verified ≥ 4.5:1; borders of inputs, steppers and focus rings ≥ 3:1.
- **Not colour alone:** availability, status, best value and errors always carry text or an icon with a label.
- **Focus:** visible 2 px `--primary` ring with 2 px offset on every focusable element; Radix primitives handle focus trap and return in `Dialog`, `Sheet`, `Drawer`.
- **Forms:** visible label on every field (no placeholder-only labels, NFR13); errors under the field, linked with `aria-describedby`, using MSG01-style copy; `inputmode="numeric"` for money, `tel` for phone; money inputs format “2.400.000” while storing an integer; values trimmed (SRS §5.2).
- **Images:** auto alt text “Ảnh {n}/{tổng} — {tiêu đề tin}”; cover image alt = title. Decorative icons `aria-hidden`.
- **Live regions:** AI answers stream into `aria-live="polite"`, announced per completed sentence, not per token; toasts use `role="status"`.
- **Tables:** compare matrix is a real `<table>` with `<th scope="row">` labels and `<th scope="col">` listing headers, so screen readers read “Gửi xe, Nhà trọ Hoa Sữa, 100.000 đ”.
- **Motion:** respect `prefers-reduced-motion`; no auto-advancing carousels.
- **Language:** `<html lang="vi">`; numbers, dates and times via `Intl` with `vi-VN` and `Asia/Ho_Chi_Minh`, dd/MM/yyyy, 24 h (SRS §5.2).

### 6.2 State catalogue

| State | Pattern | Copy | Applies to |
| --- | --- | --- | --- |
| First load | Skeleton matching final layout dimensions (card, table row, KPI tile) | — | Every list (SRS §5.2) |
| Refetch | Keep previous data at 60 % opacity + 2 px top progress bar | — | SC01 filters, SC20 period switch |
| Empty search | Illustration-free message + one “Bỏ …” button per active filter | MSG27 | SC01 |
| Empty list | Message + the action that fills it | “Chưa có phòng nào được lưu” + “Tìm phòng” | SC10, SC12, SC16, SC19 |
| Server / network error | Inline block with retry, data that loaded stays | MSG29 | Everywhere |
| Offline | Top banner “Mất kết nối mạng”, actions disabled | — | Everywhere |
| Session expired | Toast + redirect to SC07 with `?next=` | MSG28 | Authenticated screens |
| Optimistic action | Apply instantly, toast with “Hoàn tác”, rollback + MSG29 on failure | MSG08 or specific | Save, vacancy, refresh |
| Destructive confirm | `AlertDialog`; reject / hide / lock require a reason field | MSG30, MSG26 | SRS §5.2 |
| Permission denied | 403 page “Bạn không có quyền truy cập trang này” with link home | — | Role-gated routes (backend-checked, NFR05) |

### 6.3 Performance guardrails (NFR03)

- LCP ≤ 2.5 s on 4G: thumbnails in WebP with `srcset` (320 / 640 px), `fetchpriority="high"` on the first card image, lazy-load the rest.
- Fixed aspect-ratio boxes for every image and skeleton, so CLS stays under 0.1.
- Route-level code splitting: landlord and admin bundles never load for renters; the AI panel and chart library load on demand.

### 6.4 Component inventory

| Hola Nest component | Built from (shadcn/ui) | Used on |
| --- | --- | --- |
| `ListingCard` | `Card`, `AspectRatio`, `Badge`, `Checkbox` | SC01, SC03, SC10 |
| `FilterPanel` | `Sheet`, `Accordion`, `Slider`, `Checkbox`, `Switch`, `ToggleGroup` | SC01 |
| `CompareTray` | `Button`, `Avatar`, `Tooltip` | SC01, SC02, SC10 |
| `CompareMatrix` | `Table`, `Switch`, `Select` | SC11 |
| `AiAssistantPanel` | `Drawer` / `Sheet`, `ScrollArea`, `Textarea`, `Badge` | SC11 |
| `CostBreakdown` | `Card`, `Table`, `Tooltip` | SC02, SC18 |
| `StickyActionBar` | `Button` | SC02 |
| `VerifiedBadge`, `StatusBadge` | `Badge`, `Tooltip` | Everywhere |
| `VacancyStepper` | `Button` × 2, `Input` | SC16 |
| `RequestTimeline` | custom on `Card` | SC05, SC12, SC19 |
| `QueueTile` | `Card` | SC21 |
| `ConfirmWithReason` | `AlertDialog`, `Textarea` | SC19, SC22–SC26 |

### 6.5 SRS gaps that affect the UI (resolve before sprint 1 design freeze)

- [ ] **Landlord address and internal note** (comment \[9\]): SC15/SC22/SC27 show them but `landlord_profiles` has no columns. Recommend adding `property_address_hint` and `internal_note` — Admin needs the address to verify by phone (UC23 step 2), even though full addresses belong to `properties`.
- [ ] **Video:** UC19 describes uploading video files, but BR15, MSG23 and `listings.video_url` describe YouTube/TikTok links, and BR15 allows 2 videos against 1 column. Recommend link input only, with a `listing_videos` table or a limit of 1.
- [ ] **Cancel cutoff:** UC14 says cancel “(>= 1 ngày) trước ngày xem” while Bảng 3 says “trước ngày xem”. Pick one; the UI prints the exact cutoff date either way.
- [ ] **SC16 mockup** duplicates SC18 (comment \[10\]); use §4.4 as the spec.
- [ ] **Google Maps short links** (comment \[8\]): `maps.app.goo.gl` links need a server-side redirect follow; SC17 must preview coordinates and distances before saving and fall back to MSG22.
- [ ] **Section numbering:** 3.4.2 appears twice and 3.6.3 sits inside 3.7; renumber so screen references in tickets stay unambiguous.
