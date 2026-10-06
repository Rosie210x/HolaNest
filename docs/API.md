# API Documentation - SBA301 Lab03

## Swagger / OpenAPI

```text
Swagger UI:   http://localhost:8080/swagger-ui/index.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
OpenAPI YAML: http://localhost:8080/v3/api-docs.yaml

```

Base URL: `http://localhost:8080/api/v1`

> **Lưu ý Xác thực**: Hệ thống sử dụng **JWT (Bearer Token)**. Sau khi thực hiện API `POST /api/v1/auth/signin`, hãy lấy chuỗi `token` trả về và gán vào Header của tất cả các request thuộc Customer Service:
> `Authorization: Bearer <token>`

---

## Tổng quan Bảng Mapped API

| Service | Operation Description | HTTP Method | Operation Path | Purpose |
| --- | --- | --- | --- | --- |
| **Auth** | Signin | POST | `/api/v1/auth/signin` | Authenticate user and get JWT |
| **Auth** | Signup | POST | `/api/v1/auth/signup` | Register an user |
| **Customer** | List all | GET | `/api/v1/customers` | Get all customers |
| **Customer** | List with parameters | GET | `/api/v1/customers?page=x&size=y` | Get customers for page=x, size=y (lọc email, name) |
| **Customer** | Get detail | GET | `/api/v1/customers/{customerId}` | Get Customer information |
| **Customer** | Create customer | POST | `/api/v1/customers` | Create a new customer |
| **Customer** | Update customer | PUT | `/api/v1/customers/{customerId}` | Update customer by customer id |
| **Customer** | Delete a customer | DELETE | `/api/v1/customers/{customerId}` | Delete a customer |

---

## 1. Authentication Service (`/api/v1/auth`)

### 1.1 Signup (Đăng ký tài khoản)

* **URL**: `/api/v1/auth/signup`
* **Method**: `POST`
* **Purpose**: Register an user
* **Input Object**:

```json
{
  "email": "user@gmail.com",
  "password": "password123",
  "role": "ADMIN"
}

```

* **Output Object (200 OK)**:

```json
{
  "userId": 1,
  "email": "user@gmail.com",
  "role": "ADMIN"
}

```

### 1.2 Signin (Đăng nhập lấy Token)

* **URL**: `/api/v1/auth/signin`
* **Method**: `POST`
* **Purpose**: Authenticate user and get JWT
* **Input Object**:

```json
{
  "email": "user@gmail.com",
  "password": "password123"
}

```

* **Output Object (200 OK)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTY5...",
  "expireIn": 86400
}

```

---

## 2. Customer Service (`/api/v1/customers`)

### 2.1 List All (Lấy tất cả khách hàng)

* **URL**: `/api/v1/customers`
* **Method**: `GET`
* **Purpose**: Get all customers
* **Input Object**: None
* **Output Object (200 OK)**:

```json
[
  {
    "customerId": 1,
    "name": "Nguyen Van A",
    "email": "customer1@gmail.com",
    "address": "Hanoi, Vietnam",
    "mobileNo": "0987654321",
    "revenue": 1500000.0
  },
  {
    "customerId": 2,
    "name": "Tran Thi B",
    "email": "customer2@gmail.com",
    "address": "Danang, Vietnam",
    "mobileNo": "0912345678",
    "revenue": 2500000.0
  }
]

```

### 2.2 List with Parameters (Phân trang và Tìm kiếm)

* **URL**: `/api/v1/customers?page=0&size=10&email=gmail&name=Nguyen`
* **Method**: `GET`
* **Purpose**: Get customers for page=x, size=y
* **Input Object (Query Parameters)**:
* `page`: Trang số $x$ (mặc định: `0`)
* `size`: Số bản ghi $y$ trên mỗi trang (mặc định: `10`)
* `email` *(Optional)*: Lọc theo email
* `name` *(Optional)*: Lọc theo tên khách hàng


* **Output Object (200 OK)**:

```json
{
  "content": [
    {
      "customerId": 1,
      "name": "Nguyen Van A",
      "email": "customer1@gmail.com",
      "address": "Hanoi, Vietnam",
      "mobileNo": "0987654321",
      "revenue": 1500000.0
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}

```

### 2.3 Get Detail (Lấy chi tiết thông tin khách hàng)

* **URL**: `/api/v1/customers/{customerId}`
* **Method**: `GET`
* **Purpose**: Get Customer information
* **Input Object**: Path Variable `customerId`
* **Output Object (200 OK)**:

```json
{
  "customerId": 1,
  "name": "Nguyen Van A",
  "email": "customer1@gmail.com",
  "address": "Hanoi, Vietnam",
  "mobileNo": "0987654321",
  "revenue": 1500000.0
}

```

### 2.4 Create Customer (Thêm mới khách hàng)

* **URL**: `/api/v1/customers`
* **Method**: `POST`
* **Purpose**: Create a new customer
* **Input Object**:

```json
{
  "name": "Nguyen Van A",
  "email": "customer1@gmail.com",
  "address": "Hanoi, Vietnam",
  "mobileNo": "0987654321",
  "revenue": 1500000.0
}

```

* **Output Object (200 OK)**:

```json
{
  "customerId": 1,
  "name": "Nguyen Van A",
  "email": "customer1@gmail.com",
  "address": "Hanoi, Vietnam",
  "mobileNo": "0987654321",
  "revenue": 1500000.0
}

```

### 2.5 Update Customer (Cập nhật thông tin khách hàng)

* **URL**: `/api/v1/customers/{customerId}`
* **Method**: `PUT`
* **Purpose**: Update customer by customer id
* **Input Object**:

```json
{
  "customerId": 1,
  "name": "Nguyen Van A Updated",
  "email": "customer1@gmail.com",
  "address": "Ho Chi Minh, Vietnam",
  "mobileNo": "0987654321",
  "revenue": 3000000.0
}

```

* **Output Object (200 OK)**:

```json
{
  "customerId": 1,
  "name": "Nguyen Van A Updated",
  "email": "customer1@gmail.com",
  "address": "Ho Chi Minh, Vietnam",
  "mobileNo": "0987654321",
  "revenue": 3000000.0
}

```

### 2.6 Delete Customer (Xóa khách hàng)

* **URL**: `/api/v1/customers/{customerId}`
* **Method**: `DELETE`
* **Purpose**: Delete a customer
* **Input Object**: Path Variable `customerId`
* **Output Object**: `204 No Content` (Không có body)

---

## 3. Quy tắc Validation & Định dạng Lỗi (Error Format)

| Class DTO | Trường (Field) | Quy tắc Validation (Rule) |
| --- | --- | --- |
| `SignUpRequest` | `email` | Bắt buộc (Not Blank), đúng định dạng Email |
| `SignUpRequest` | `password` | Bắt buộc (Not Blank), tối thiểu 6 ký tự |
| `SignUpRequest` | `role` | Bắt buộc (Not Blank) |
| `SignInRequest` | `email` | Bắt buộc (Not Blank), đúng định dạng Email |
| `SignInRequest` | `password` | Bắt buộc (Not Blank) |
| `CustomerCreateRequest` / `CustomerUpdateRequest` | `name` | Bắt buộc (Not Blank) |
| `CustomerCreateRequest` / `CustomerUpdateRequest` | `email` | Bắt buộc (Not Blank), đúng định dạng Email, không trùng lặp |
| `CustomerCreateRequest` / `CustomerUpdateRequest` | `address` | Bắt buộc (Not Blank) |
| `CustomerCreateRequest` / `CustomerUpdateRequest` | `mobileNo` | Bắt buộc (Not Blank) |
| `CustomerCreateRequest` / `CustomerUpdateRequest` | `revenue` | Bắt buộc (Not Null), kiểu số $\ge 0$ |

### Mẫu trả về lỗi Validation (400 Bad Request)

```json
{
  "timestamp": "2026-09-22T16:45:00+07:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Dữ liệu không hợp lệ",
  "path": "/api/v1/customers",
  "fieldErrors": {
    "email": "Email không đúng định dạng",
    "revenue": "Revenue phải lớn hơn hoặc bằng 0"
  }
}

```

### Mẫu trả về lỗi Xung đột dữ liệu / Không tìm thấy (409 Conflict / 404 Not Found)

```json
{
  "timestamp": "2026-09-22T16:45:00+07:00",
  "status": 409,
  "error": "Conflict",
  "message": "Email 'customer1@gmail.com' đã tồn tại trong hệ thống",
  "path": "/api/v1/customers"
}

```

```

```