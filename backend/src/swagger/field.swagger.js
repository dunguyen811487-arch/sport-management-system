/**
 * @swagger
 * tags:
 *   name: Field
 *   description: API quản lý sân thể thao
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Field:
 *       type: object
 *       properties:
 *
 *         _id:
 *           type: string
 *           example: 68a123456789abcdef123456
 *
 *         fieldName:
 *           type: string
 *           example: Sân bóng đá A
 *
 *         fieldTypeId:
 *           type: string
 *           example: 68a123456789abcdef123457
 *
 *         location:
 *           type: string
 *           example: Trà Vinh
 *
 *         pricePerHour:
 *           type: number
 *           example: 200000
 *
 *         image:
 *           type: string
 *           example: /uploads/fields/football-a.png
 *
 *         description:
 *           type: string
 *           example: Sân bóng đá 7 người, có đèn chiếu sáng
 *
 *         rating:
 *           type: number
 *           example: 0
 *
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - maintenance
 *           example: active
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *
 *     CreateFieldRequest:
 *       type: object
 *       required:
 *         - fieldName
 *         - fieldTypeId
 *         - pricePerHour
 *       properties:
 *
 *         fieldName:
 *           type: string
 *           example: Sân bóng đá A
 *
 *         fieldTypeId:
 *           type: string
 *           example: 68a123456789abcdef123457
 *
 *         location:
 *           type: string
 *           example: Trà Vinh
 *
 *         pricePerHour:
 *           type: number
 *           example: 200000
 *
 *         image:
 *           type: string
 *           format: binary
 *
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - maintenance
 *           example: active
 *
 *         description:
 *           type: string
 *           example: Sân bóng đá 7 người
 *
 *
 *     UpdateFieldRequest:
 *       type: object
 *       properties:
 *
 *         fieldName:
 *           type: string
 *           example: Sân bóng đá A - Updated
 *
 *         fieldTypeId:
 *           type: string
 *           example: 68a123456789abcdef123457
 *
 *         location:
 *           type: string
 *           example: Trà Vinh
 *
 *         pricePerHour:
 *           type: number
 *           example: 250000
 *
 *         image:
 *           type: string
 *           format: binary
 *
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - maintenance
 *           example: active
 *
 *         description:
 *           type: string
 *           example: Sân bóng đá mới được nâng cấp
 */


/**
 * @swagger
 * /api/fields:
 *   post:
 *     summary: Tạo sân thể thao
 *     description: Tạo một sân thể thao mới.
 *     tags:
 *       - Field
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateFieldRequest'
 *
 *     responses:
 *       201:
 *         description: Tạo sân thành công
 *
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/fields:
 *   get:
 *     summary: Lấy danh sách sân
 *     description: Lấy toàn bộ sân thể thao trong hệ thống.
 *     tags:
 *       - Field
 *
 *     responses:
 *       200:
 *         description: Lấy danh sách sân thành công
 *
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/fields/{id}:
 *   get:
 *     summary: Lấy sân theo ID
 *     description: Lấy thông tin chi tiết của một sân.
 *     tags:
 *       - Field
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sân
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Lấy thông tin sân thành công
 *
 *       404:
 *         description: Không tìm thấy sân
 *
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/fields/{id}:
 *   put:
 *     summary: Cập nhật sân
 *     description: Cập nhật thông tin sân thể thao.
 *     tags:
 *       - Field
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sân
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123456
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFieldRequest'
 *
 *     responses:
 *       200:
 *         description: Cập nhật sân thành công
 *
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 *       404:
 *         description: Không tìm thấy sân
 *
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/fields/{id}:
 *   delete:
 *     summary: Xóa sân
 *     description: Xóa một sân thể thao khỏi hệ thống.
 *     tags:
 *       - Field
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sân
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Xóa sân thành công
 *
 *       400:
 *         description: Không thể xóa sân
 *
 *       404:
 *         description: Không tìm thấy sân
 *
 *       500:
 *         description: Lỗi server
 */