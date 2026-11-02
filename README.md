# Hola Nest

Nền tảng tìm và cho thuê phòng trọ quanh Hòa Lạc. Yêu cầu chi tiết nằm trong SRS (Project Code HN01).

Hiện có phần nền: tài khoản, JWT + Spring Security trong cookie, RBAC, chuẩn lỗi và Swagger.

- Backend: Spring Boot 3.5, Spring Security, Spring Data JPA, SQL Server (Java 17+)
- Frontend: React 19, React Router, Tailwind CSS 4, shadcn/ui ([frontend/](frontend/))

## Chạy trên máy

1. Tạo database: `sqlcmd -S localhost -U sa -i database/create-database.sql`
2. Sao chép `.env.example` thành `.env` và điền `DB_PASSWORD`, `JWT_SECRET` (`openssl rand -base64 48`).
   Điền `APP_SEED_PASSWORD` nếu muốn tạo sẵn tài khoản Admin.
3. Chạy backend ở thư mục gốc: `mvn spring-boot:run`. JPA tự tạo bảng.
4. Chạy frontend: `cd frontend`, `npm install`, `npm run dev`, rồi mở http://localhost:5173.

Swagger UI: http://localhost:8080/swagger-ui.html. API được mô tả trong [docs/API.md](docs/API.md).

Chạy test (dùng H2, không cần SQL Server): `mvn test`.

## Triển khai

Bắt buộc đặt `JWT_SECRET`, `DB_*` bằng biến môi trường, không dùng `.env`. Backend sẽ không khởi động nếu thiếu
hoặc secret ngắn hơn 32 byte. Giữ `COOKIE_SECURE=true`, phục vụ qua HTTPS, đặt `FORWARD_HEADERS_STRATEGY=native`
khi đứng sau reverse proxy, và để frontend cùng site với API. Đặt `SWAGGER_ENABLED=false` nếu không muốn công khai
tài liệu API, và giữ `APP_SEED_DEMO_USERS=false`.
