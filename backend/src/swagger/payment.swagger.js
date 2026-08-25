/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: API quản lý thanh toán
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Payment:
 *       type: object
 *       properties:
 *
 *         _id:
 *           type: string
 *           example: 6a798ec7f14539b50ff1c839
 *
 *         bookingId:
 *           type: string
 *           example: 6a781ee9b77394a45de16bb9
 *
 *         amount:
 *           type: number
 *           description: Số tiền thanh toán, được lấy tự động từ totalPrice của Booking
 *           example: 400000
 *
 *         paymentMethod:
 *           type: string
 *           enum:
 *             - cash
 *             - bank_transfer
 *           description: Phương thức thanh toán
 *           example: cash
 *
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - paid
 *             - failed
 *             - refunded
 *           description: Trạng thái thanh toán
 *           example: pending
 *
 *         transactionCode:
 *           type: string
 *           description: Mã giao dịch, bắt buộc khi thanh toán bằng chuyển khoản
 *           example: MB123456789
 *
 *         paidAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Thời gian thanh toán thành công
 *           example: 2026-08-10T09:37:30.923Z
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Tạo thanh toán
 *     description: |
 *       Customer tạo thanh toán cho booking của chính mình.
 *
 *       Có 2 phương thức thanh toán:
 *       - cash: Thanh toán trực tiếp tại sân
 *       - bank_transfer: Thanh toán bằng chuyển khoản
 *
 *       amount được hệ thống tự động lấy từ totalPrice của Booking.
 *       Customer không cần gửi amount.
 *
 *       Khi sử dụng bank_transfer, transactionCode là bắt buộc.
 *       Khi sử dụng cash, transactionCode không cần nhập.
 *     tags:
 *       - Payment
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - paymentMethod
 *
 *             properties:
 *
 *               bookingId:
 *                 type: string
 *                 description: ID của booking cần thanh toán
 *                 example: 6a781ee9b77394a45de16bb9
 *
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - cash
 *                   - bank_transfer
 *                 description: Phương thức thanh toán
 *                 example: cash
 *
 *               transactionCode:
 *                 type: string
 *                 description: Bắt buộc nếu paymentMethod là bank_transfer
 *                 example: MB123456789
 *
 *     responses:
 *
 *       201:
 *         description: Tạo thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tạo thanh toán thành công
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *
 *       400:
 *         description: Dữ liệu thanh toán không hợp lệ
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Customer không có quyền thanh toán booking này
 *
 *       404:
 *         description: Không tìm thấy booking
 */

/**
 * @swagger
 * /api/payments/my:
 *   get:
 *     summary: Xem danh sách payment của Customer
 *     description: Customer chỉ được xem các payment thuộc những booking do mình tạo.
 *     tags:
 *       - Payment
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Lấy danh sách payment thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Chỉ Customer được sử dụng API này
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Xem tất cả payment
 *     description: Staff và Admin được xem toàn bộ danh sách thanh toán.
 *     tags:
 *       - Payment
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Lấy danh sách payment thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Chỉ Staff hoặc Admin được sử dụng API này
 */

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Xem payment theo ID
 *     description: |
 *       Customer, Staff và Admin đều có thể xem payment theo ID.
 *
 *       Customer chỉ được xem payment thuộc booking của chính mình.
 *       Staff và Admin được xem payment bất kỳ.
 *     tags:
 *       - Payment
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của payment
 *         schema:
 *           type: string
 *         example: 6a798ec7f14539b50ff1c839
 *
 *     responses:
 *
 *       200:
 *         description: Lấy payment thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Customer không có quyền xem payment này
 *
 *       404:
 *         description: Không tìm thấy payment
 */

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Cập nhật payment
 *     description: |
 *       Staff và Admin được phép cập nhật trạng thái payment.
 *
 *       Các trạng thái:
 *       - pending: Chờ thanh toán
 *       - paid: Đã thanh toán
 *       - failed: Thanh toán thất bại
 *       - refunded: Đã hoàn tiền
 *
 *       Khi chuyển sang paid:
 *       - paidAt được tự động cập nhật
 *       - Booking tương ứng chuyển sang confirmed
 *
 *       Khi chuyển sang refunded:
 *       - paidAt được đặt lại null
 *       - Booking tương ứng chuyển sang cancelled
 *
 *       bookingId và amount không được phép thay đổi.
 *     tags:
 *       - Payment
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của payment
 *         schema:
 *           type: string
 *         example: 6a798ec7f14539b50ff1c839
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - cash
 *                   - bank_transfer
 *                 example: cash
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - paid
 *                   - failed
 *                   - refunded
 *                 example: paid
 *
 *               transactionCode:
 *                 type: string
 *                 example: MB123456789
 *
 *     responses:
 *
 *       200:
 *         description: Cập nhật payment thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cập nhật payment thành công
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *
 *       400:
 *         description: Dữ liệu cập nhật không hợp lệ
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Chỉ Staff hoặc Admin được cập nhật payment
 *
 *       404:
 *         description: Không tìm thấy payment
 */

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Xóa payment
 *     description: Chỉ Admin được phép xóa payment.
 *     tags:
 *       - Payment
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của payment
 *         schema:
 *           type: string
 *         example: 6a798ec7f14539b50ff1c839
 *
 *     responses:
 *
 *       200:
 *         description: Xóa payment thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Xóa payment thành công
 *
 *       400:
 *         description: Không thể xóa payment
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Chỉ Admin được xóa payment
 *
 *       404:
 *         description: Không tìm thấy payment
 */