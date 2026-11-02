# Hola Nest API

Swagger UI: http://localhost:8080/swagger-ui.html (OpenAPI JSON: `/v3/api-docs`). OpenAPI là hợp đồng giữa
frontend và backend (NFR10); tài liệu này chỉ tóm tắt các quy ước chung.

Base URL: `/api/v1`

## Xác thực bằng cookie

| Cookie | Nội dung | Thời hạn | Path | Thuộc tính |
| --- | --- | --- | --- | --- |
| `access_token` | JWT HS256 | 15 phút | `/api` | HttpOnly, Secure, SameSite=Strict |
| `refresh_token` | Mã ngẫu nhiên, DB chỉ lưu SHA-256 | 7 ngày | `/api/v1/auth` | HttpOnly, Secure, SameSite=Strict |
| `XSRF-TOKEN` | CSRF token | Theo phiên trình duyệt | `/` | Secure, SameSite=Strict, JavaScript đọc được |

- Token không bao giờ xuất hiện trong response body.
- POST/PUT/PATCH/DELETE phải gửi header `X-XSRF-TOKEN` bằng giá trị cookie `XSRF-TOKEN`. Mọi response đều đặt cookie
  này; axios và Swagger UI tự gửi header.
- Khi nhận 401, frontend gọi `POST /auth/refresh` một lần rồi thử lại yêu cầu.
- Mỗi lần refresh sẽ đổi refresh token. Dùng lại token cũ sau 10 giây bị coi là token bị đánh cắp và cả phiên bị hủy.
- Phiên và vai trò được kiểm tra lại từ DB ở mỗi yêu cầu, nên đăng xuất, khóa tài khoản và đổi vai trò có hiệu lực ngay.

## Endpoint

| Method | Path | Quyền | Mô tả |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Công khai | Đăng ký vai trò Người thuê và đăng nhập ngay (UC01) |
| POST | `/auth/signin` | Công khai | Đăng nhập (UC02) |
| POST | `/auth/refresh` | Cookie refresh | Cấp lại token |
| POST | `/auth/signout` | Công khai | Hủy phiên, xóa cookie (UC02) |
| GET | `/auth/me` | Đã đăng nhập | Tài khoản và vai trò hiện tại |
| GET | `/renter/access-check` | RENTER | Kiểm tra RBAC |
| GET | `/landlord/access-check` | LANDLORD | Kiểm tra RBAC |
| GET | `/admin/access-check` | ADMIN | Kiểm tra RBAC |

## Phân quyền (RBAC)

Một tài khoản có nhiều vai trò (BR01). Chủ trọ vẫn giữ vai trò RENTER; Admin chỉ có ADMIN.

| Đường dẫn | Quyền ở `SecurityConfig` |
| --- | --- |
| `GET /api/v1/public/**` | Công khai |
| `/api/v1/renter/**` | RENTER |
| `/api/v1/landlord/**` | LANDLORD hoặc ADMIN (dùng cho đăng tin hộ, thu hẹp thêm bằng `@PreAuthorize`) |
| `/api/v1/admin/**` | ADMIN |
| Còn lại | Đã đăng nhập |

## Định dạng lỗi

```json
{
  "timestamp": "2026-11-02T16:00:00+07:00",
  "status": 400,
  "error": "Bad Request",
  "code": "MSG01",
  "message": "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
  "path": "/api/v1/auth/signup",
  "fieldErrors": { "phone": "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0." }
}
```

| HTTP | `code` | Trường hợp |
| --- | --- | --- |
| 400 | `MSG01` | Dữ liệu không hợp lệ |
| 401 | `MSG03` | Sai email hoặc mật khẩu |
| 401 | `MSG28` | Phiên đã hết hạn |
| 401 | `AUTH_REQUIRED` | Chưa đăng nhập |
| 403 | `MSG05` | Tài khoản bị khóa |
| 403 | `ACCESS_DENIED` | Không đủ quyền |
| 403 | `CSRF_INVALID` | Thiếu hoặc sai CSRF token |
| 409 | `MSG02` | Email đã được sử dụng |
| 423 | `MSG04` | Sai mật khẩu 5 lần, tạm khóa 15 phút |
| 429 | `MSG31` | Vượt 30 yêu cầu/phút/IP ở signin, signup |
| 500 | `MSG29` | Lỗi máy chủ |
| Khác | `HTTP_<status>` | Lỗi của framework, ví dụ `HTTP_404`, `HTTP_405` |
