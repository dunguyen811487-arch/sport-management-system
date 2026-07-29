# Authentication API

## 1. Giới thiệu

Authentication API chịu trách nhiệm xác thực và quản lý tài khoản người dùng trong hệ thống quản lý và vận hành sân thể thao.

Các chức năng bao gồm:

- Đăng ký tài khoản
- Đăng nhập
- Lấy thông tin người dùng hiện tại
- Đổi mật khẩu
- Đăng xuất

---

# Base URL

```
http://localhost:5000/api/auth
```

---

# Authentication

Một số API yêu cầu người dùng phải đăng nhập.

JWT Token được gửi trong Header:

```
Authorization: Bearer <JWT_TOKEN>
```

Ví dụ:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

---

# Response Format

## Thành công

```json
{
    "success": true,
    "message": "Success",
    "data": {}
}
```

---

## Thất bại

```json
{
    "success": false,
    "message": "Error message"
}
```

---

# 1. Register

Tạo tài khoản khách hàng mới.

## Endpoint

```
POST /register
```

## Permission

Public

## Request Header

```
Content-Type: application/json
```

## Request Body

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| fullName | String | Yes | Họ và tên |
| email | String | Yes | Email đăng nhập |
| password | String | Yes | Mật khẩu |
| phone | String | Yes | Số điện thoại |

### Example Request

```json
{
    "fullName": "Nguyễn Văn A",
    "email": "vana@gmail.com",
    "password": "123456",
    "phone": "0901234567"
}
```

---

## Validation

- fullName không được để trống
- Email đúng định dạng
- Email chưa tồn tại
- Password tối thiểu 6 ký tự
- Phone đúng định dạng

---

## Business Logic

- Kiểm tra Email đã tồn tại chưa
- Hash Password bằng bcrypt
- Role mặc định là customer
- Status mặc định là active
- Lưu vào MongoDB

---

## Success Response

HTTP Status

```
201 Created
```

```json
{
    "success": true,
    "message": "Register successfully"
}
```

---

## Error Response

HTTP Status

```
409 Conflict
```

```json
{
    "success": false,
    "message": "Email already exists"
}
```

---

# 2. Login

Đăng nhập hệ thống.

## Endpoint

```
POST /login
```

## Permission

Public

## Request Header

```
Content-Type: application/json
```

## Request Body

| Field | Type | Required |
|--------|------|----------|
| email | String | Yes |
| password | String | Yes |

### Example Request

```json
{
    "email": "vana@gmail.com",
    "password": "123456"
}
```

---

## Business Logic

- Kiểm tra Email
- So sánh Password bằng bcrypt.compare()
- Sinh JWT Token
- Trả thông tin người dùng

---

## Success Response

HTTP Status

```
200 OK
```

```json
{
    "success": true,
    "message": "Login successfully",
    "data": {
        "token": "JWT_TOKEN",
        "user": {
            "_id": "687123456",
            "fullName": "Nguyễn Văn A",
            "email": "vana@gmail.com",
            "role": "customer"
        }
    }
}
```

---

## Error Response

HTTP Status

```
401 Unauthorized
```

```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

---

# 3. Get Profile

Lấy thông tin người dùng hiện tại.

## Endpoint

```
GET /profile
```

## Permission

Customer

Staff

Admin

## Header

```
Authorization: Bearer JWT_TOKEN
```

---

## Success Response

HTTP Status

```
200 OK
```

```json
{
    "success": true,
    "data": {
        "_id": "687123456",
        "fullName": "Nguyễn Văn A",
        "email": "vana@gmail.com",
        "phone": "0901234567",
        "role": "customer"
    }
}
```

---

## Error Response

HTTP Status

```
401 Unauthorized
```

```json
{
    "success": false,
    "message": "Unauthorized"
}
```

---

# 4. Change Password

Đổi mật khẩu.

## Endpoint

```
PUT /change-password
```

## Permission

Customer

Staff

Admin

## Header

```
Authorization: Bearer JWT_TOKEN
```

## Request Body

```json
{
    "oldPassword": "123456",
    "newPassword": "123456789"
}
```

---

## Validation

- oldPassword đúng
- newPassword tối thiểu 6 ký tự

---

## Success Response

HTTP Status

```
200 OK
```

```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Old password is incorrect"
}
```

---

# 5. Logout

Đăng xuất khỏi hệ thống.

## Endpoint

```
POST /logout
```

## Permission

Customer

Staff

Admin

## Header

```
Authorization: Bearer JWT_TOKEN
```

---

## Business Logic

Frontend sẽ xóa JWT Token khỏi Local Storage hoặc Cookie.

Backend chỉ trả về thông báo thành công.

---

## Success Response

```json
{
    "success": true,
    "message": "Logout successfully"
}
```

---

# HTTP Status Code

| Code | Ý nghĩa |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# JWT Payload

```json
{
    "id": "687123456",
    "role": "customer"
}
```

---

# Authentication Flow

```
User
   │
   ▼
Register
   │
   ▼
MongoDB
   │
   ▼
Login
   │
   ▼
Generate JWT
   │
   ▼
Frontend lưu Token
   │
   ▼
Authorization: Bearer <JWT_TOKEN>
   │
   ▼
JWT Middleware
   │
   ▼
Protected APIs
```

---

# Related APIs

| Module | Endpoint |
|----------|-------------------------|
| User | /api/users |
| Field | /api/fields |
| Booking | /api/bookings |
| Payment | /api/payments |
