# Hola Nest frontend

`npm install`, rồi `npm run dev` (http://localhost:5173). Vite chuyển tiếp `/api` tới backend ở cổng 8080.

Token nằm trong cookie httpOnly nên JavaScript không đọc được. Người dùng hiện tại lấy từ `GET /auth/me`
qua loader của route gốc; trong component dùng `useCurrentUser()` ở [src/auth/session.js](src/auth/session.js).

Giao diện dùng Tailwind CSS 4 và shadcn/ui (Radix). Token màu, font, cỡ chữ theo [docs/ui-blueprint.md](../docs/ui-blueprint.md) §2
nằm trong [src/index.css](src/index.css). Thêm component bằng `npx shadcn@latest add <tên>`; file trong `src/components/ui`
do CLI sinh ra, khung trang (header, tab bar dưới trên mobile, footer) nằm trong `src/components/layout`.
