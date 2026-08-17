/**
 * @swagger
 * tags:
 *   name: Report
 *   description: API báo cáo thống kê
 */


/**
 * @swagger
 * components:
 *   schemas:
 *
 *     ReportDailyStat:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           example: "2026-08-14"
 *
 *         bookings:
 *           type: integer
 *           example: 15
 *
 *         confirmed:
 *           type: integer
 *           example: 10
 *
 *         pending:
 *           type: integer
 *           example: 2
 *
 *         cancelled:
 *           type: integer
 *           example: 3
 *
 *         completed:
 *           type: integer
 *           example: 0
 *
 *         revenue:
 *           type: number
 *           example: 1200000
 *
 *
 *     Report:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 68a123456789abcdef123456
 *
 *         reportType:
 *           type: string
 *           example: booking_revenue
 *
 *         fromDate:
 *           type: string
 *           format: date-time
 *
 *         toDate:
 *           type: string
 *           format: date-time
 *
 *         totalRevenue:
 *           type: number
 *           example: 1200000
 *
 *         totalPaidPayments:
 *           type: integer
 *           example: 10
 *
 *         totalBookings:
 *           type: integer
 *           example: 15
 *
 *         confirmedBookings:
 *           type: integer
 *           example: 10
 *
 *         pendingBookings:
 *           type: integer
 *           example: 2
 *
 *         cancelledBookings:
 *           type: integer
 *           example: 3
 *
 *         completedBookings:
 *           type: integer
 *           example: 0
 *
 *         dailyStats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportDailyStat'
 *
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
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
 * /api/reports:
 *   post:
 *     summary: Tạo báo cáo thống kê
 *     description: Tạo báo cáo doanh thu và tình hình đặt sân trong khoảng thời gian.
 *     tags:
 *       - Report
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
 *               - fromDate
 *               - toDate
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum:
 *                   - booking_revenue
 *                 example: booking_revenue
 *
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-14"
 *
 *     responses:
 *       201:
 *         description: Tạo báo cáo thành công
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
 *                   example: Tạo báo cáo thành công
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Không có quyền
 */


/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Lấy danh sách báo cáo
 *     description: Lấy toàn bộ báo cáo đã được tạo.
 *     tags:
 *       - Report
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lấy danh sách báo cáo thành công
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
 *                     $ref: '#/components/schemas/Report'
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Không có quyền
 */


/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Lấy báo cáo theo ID
 *     description: Lấy thông tin chi tiết của một báo cáo.
 *     tags:
 *       - Report
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID báo cáo
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Lấy báo cáo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Không có quyền
 *
 *       404:
 *         description: Không tìm thấy báo cáo
 */


/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Xóa báo cáo
 *     description: Xóa một báo cáo đã lưu.
 *     tags:
 *       - Report
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID báo cáo
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Xóa báo cáo thành công
 *
 *       401:
 *         description: Chưa đăng nhập
 *
 *       403:
 *         description: Không có quyền
 *
 *       404:
 *         description: Không tìm thấy báo cáo
 */