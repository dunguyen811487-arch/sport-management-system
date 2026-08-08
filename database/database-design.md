# Database Design

# 1. Giới thiệu

Hệ thống vận hành và quản lý sân thể thao sử dụng **MongoDB** làm hệ quản trị cơ sở dữ liệu. MongoDB là cơ sở dữ liệu NoSQL lưu trữ dữ liệu dưới dạng Document (JSON), giúp dễ dàng mở rộng và phù hợp với các ứng dụng Web sử dụng Node.js và Express.

Hệ thống được thiết kế với các Collection độc lập, liên kết với nhau thông qua ObjectId nhằm đảm bảo tính nhất quán của dữ liệu và thuận tiện trong quá trình phát triển.

---

# 2. Danh sách Collection

Hệ thống gồm 5 Collection chính:

| STT | Collection | Mô tả |
|-----|------------|--------------------------------------------|
| 1 | users | Lưu thông tin người dùng |
| 2 | field_types | Lưu loại sân thể thao |
| 3 | fields | Lưu thông tin sân |
| 4 | bookings | Lưu thông tin đặt sân |
| 5 | payments | Lưu thông tin thanh toán |

---

# 3. Thiết kế Collection

## 3.1 Collection: users

Lưu thông tin của tất cả người dùng trong hệ thống.

### Thuộc tính

| Trường | Kiểu dữ liệu | Mô tả |
|---------|-------------|------------------------------|
| _id | ObjectId | Khóa chính |
| fullName | String | Họ và tên |
| email | String | Email đăng nhập |
| password | String | Mật khẩu đã mã hóa |
| phone | String | Số điện thoại |
| role | String | admin, staff, customer |
| avatar | String | Ảnh đại diện |
| status | String | active, inactive |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 3.2 Collection: field_types

Lưu thông tin loại sân.

Ví dụ:

- Sân bóng đá 5 người
- Sân bóng đá 7 người
- Cầu lông
- Tennis
- Pickleball

### Thuộc tính

| Trường | Kiểu dữ liệu | Mô tả |
|---------|-------------|----------------|
| _id | ObjectId | Khóa chính |
| name | String | Tên loại sân |
| description | String | Mô tả |

---

## 3.3 Collection: fields

Lưu thông tin từng sân.

### Thuộc tính

| Trường | Kiểu dữ liệu | Mô tả |
|---------|-------------|-------------------------|
| _id | ObjectId | Khóa chính |
| fieldTypeId | ObjectId | Tham chiếu field_types |
| fieldName | String | Tên sân |
| location | String | Vị trí sân |
| pricePerHour | Number | Giá thuê theo giờ |
| image | String | Hình ảnh sân |
| description | String | Mô tả |
| status | String | active, maintenance, inactive |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 3.4 Collection: bookings

Đây là Collection quan trọng nhất của hệ thống.

Lưu toàn bộ lịch đặt sân của khách hàng.

### Thuộc tính

| Trường | Kiểu dữ liệu | Mô tả |
|---------|-------------|------------------------------|
| _id | ObjectId | Khóa chính |
| customerId | ObjectId | Tham chiếu users |
| fieldId | ObjectId | Tham chiếu fields |
| bookingDate | Date | Ngày đặt sân |
| startTime | String | Giờ bắt đầu |
| endTime | String | Giờ kết thúc |
| totalHours | Number | Tổng số giờ thuê |
| totalPrice | Number | Tổng tiền |
| status | String | pending, confirmed, completed, cancelled |
| note | String | Ghi chú |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

### Quy tắc đặt sân

Hệ thống sẽ không cho phép tạo Booking mới nếu:

- Cùng sân
- Cùng ngày
- Khoảng thời gian đặt bị giao nhau

Ví dụ:

Booking A

18:00 → 20:00

Booking B

19:00 → 21:00

=> Không hợp lệ.

Booking C

20:00 → 22:00

=> Hợp lệ.

---

## 3.5 Collection: payments

Lưu thông tin thanh toán.

### Thuộc tính

| Trường | Kiểu dữ liệu | Mô tả |
|---------|-------------|-----------------------------|
| _id | ObjectId | Khóa chính |
| bookingId | ObjectId | Tham chiếu bookings |
| amount | Number | Số tiền |
| paymentMethod | String | Cash, VNPay, MoMo |
| paymentStatus | String | pending, paid, failed |
| transactionCode | String | Mã giao dịch |
| paidAt | Date | Thời gian thanh toán |
| createdAt | Date | Ngày tạo |

---

# 4. Quan hệ giữa các Collection

## User và Booking

Một khách hàng có thể đặt nhiều sân.

Quan hệ:

1 User → N Bookings

---

## FieldType và Field

Một loại sân có thể có nhiều sân.

Quan hệ:

1 FieldType → N Fields

---

## Field và Booking

Một sân có thể có nhiều lượt đặt ở các thời điểm khác nhau.

Quan hệ:

1 Field → N Bookings

---

## Booking và Payment

Mỗi lượt đặt sân chỉ có một giao dịch thanh toán.

Quan hệ:

1 Booking → 1 Payment

---

# 5. Sơ đồ quan hệ

User (1)
│
│
└──────────────< Booking >────────────── Field (1)
                       │
                       │
                       │
                    Payment (1)

FieldType (1)
      │
      │
      └──────────────< Field

---

# 6. Quy tắc nghiệp vụ

## Quản lý sân

- Mỗi sân thuộc đúng một loại sân.
- Giá thuê được tính theo giờ.
- Chỉ những sân có trạng thái active mới được phép đặt.

---

## Đặt sân

- Khách hàng phải đăng nhập mới được đặt sân.
- Không được đặt trùng khung giờ.
- Không được đặt sân đã bảo trì.
- Tổng tiền = Giá theo giờ × Tổng số giờ thuê.

---

## Thanh toán

- Mỗi Booking chỉ có một Payment.
- Booking chỉ được xác nhận sau khi thanh toán thành công (hoặc được nhân viên xác nhận nếu áp dụng thanh toán tiền mặt).

---

# 7. Công nghệ sử dụng

- Database: MongoDB
- ODM: Mongoose
- Backend: Node.js + Express
- Authentication: JWT
- API: RESTful API
- Documentation: Swagger
- Container: Docker