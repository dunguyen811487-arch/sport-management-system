/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: API quản lý đặt sân
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6a7821b5a168303b6a3885ef
 *
 *         customerId:
 *           type: string
 *           example: 6a743d62d4950f51abb6c862
 *
 *         fieldId:
 *           type: string
 *           example: 6a729273483f2402d25bd70a
 *
 *         bookingDate:
 *           type: string
 *           format: date
 *           example: 2026-08-11
 *
 *         startTime:
 *           type: string
 *           example: "17:00"
 *
 *         endTime:
 *           type: string
 *           example: "19:00"
 *
 *         totalPrice:
 *           type: number
 *           example: 400000
 *
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - cancelled
 *           example: pending
 *
 *         note:
 *           type: string
 *           example: ""
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
 * /api/bookings:
 *   post:
 *     summary: Tạo booking
 *     description: Customer tạo booking để đặt sân. customerId được lấy tự động từ JWT.
 *     tags:
 *       - Booking
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
 *               - fieldId
 *               - bookingDate
 *               - startTime
 *               - endTime
 *             properties:
 *               fieldId:
 *                 type: string
 *                 example: 6a729273483f2402d25bd70a
 *
 *               bookingDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-11
 *
 *               startTime:
 *                 type: string
 *                 example: "15:00"
 *
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *
 *               note:
 *                 type: string
 *                 example: ""
 *
 *     responses:
 *       201:
 *         description: Tạo booking thành công
 *
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc khung giờ bị trùng
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Không có quyền
 */

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     summary: Xem booking của Customer
 *     description: Customer chỉ được xem các booking do chính mình tạo.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lấy danh sách booking thành công
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Chỉ Customer được sử dụng API này
 */

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Customer hủy booking
 *     description: Customer chỉ được hủy booking của chính mình.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a7821b5a168303b6a3885ef
 *
 *     responses:
 *       200:
 *         description: Hủy booking thành công
 *
 *       404:
 *         description: Không tìm thấy booking
 *
 *       403:
 *         description: Không có quyền hủy booking
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Xem tất cả booking
 *     description: Staff và Admin được xem toàn bộ booking trong hệ thống.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lấy danh sách booking thành công
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Chỉ Staff hoặc Admin được sử dụng API này
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Xem booking theo ID
 *     description: Staff và Admin được xem booking theo ID.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a7821b5a168303b6a3885ef
 *
 *     responses:
 *       200:
 *         description: Lấy booking thành công
 *
 *       404:
 *         description: Không tìm thấy booking
 *
 *       403:
 *         description: Không có quyền
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Cập nhật booking
 *     description: Staff và Admin có thể cập nhật booking. Khi thay đổi sân hoặc giờ, hệ thống kiểm tra chồng giờ và tự tính lại totalPrice.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a7821b5a168303b6a3885ef
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fieldId:
 *                 type: string
 *                 example: 6a729273483f2402d25bd70a
 *
 *               bookingDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-11
 *
 *               startTime:
 *                 type: string
 *                 example: "18:00"
 *
 *               endTime:
 *                 type: string
 *                 example: "20:00"
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - confirmed
 *                   - cancelled
 *
 *               note:
 *                 type: string
 *                 example: ""
 *
 *     responses:
 *       200:
 *         description: Cập nhật booking thành công
 *
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc khung giờ bị trùng
 *
 *       404:
 *         description: Không tìm thấy booking
 *
 *       403:
 *         description: Chỉ Staff hoặc Admin được sử dụng API này
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Xóa booking
 *     description: Chỉ Admin được phép xóa booking.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a7821b5a168303b6a3885ef
 *
 *     responses:
 *       200:
 *         description: Xóa booking thành công
 *
 *       404:
 *         description: Không tìm thấy booking
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Chỉ Admin được sử dụng API này
 */