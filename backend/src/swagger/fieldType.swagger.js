/**
 * @swagger
 * tags:
 *   name: FieldType
 *   description: API quản lý loại sân
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     FieldType:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 68a123456789abcdef123457
 *
 *         name:
 *           type: string
 *           example: Sân bóng đá
 *
 *         description:
 *           type: string
 *           example: Loại sân bóng đá 7 người
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
 *     CreateFieldTypeRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Sân bóng đá
 *
 *         description:
 *           type: string
 *           example: Loại sân bóng đá 7 người
 *
 *
 *     UpdateFieldTypeRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Sân cầu lông
 *
 *         description:
 *           type: string
 *           example: Loại sân cầu lông trong nhà
 */

/**
 * @swagger
 * /api/field-types:
 *   post:
 *     summary: Tạo loại sân
 *     description: Tạo một loại sân mới.
 *     tags:
 *       - FieldType
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFieldTypeRequest'
 *
 *     responses:
 *       201:
 *         description: Tạo loại sân thành công
 *
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /api/field-types:
 *   get:
 *     summary: Lấy danh sách loại sân
 *     description: Lấy toàn bộ loại sân trong hệ thống.
 *     tags:
 *       - FieldType
 *
 *     responses:
 *       200:
 *         description: Lấy danh sách loại sân thành công
 *
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/field-types/{id}:
 *   get:
 *     summary: Lấy loại sân theo ID
 *     description: Lấy thông tin chi tiết của một loại sân.
 *     tags:
 *       - FieldType
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của loại sân
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123457
 *
 *     responses:
 *       200:
 *         description: Lấy thông tin loại sân thành công
 *
 *       404:
 *         description: Không tìm thấy loại sân
 *
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/field-types/{id}:
 *   put:
 *     summary: Cập nhật loại sân
 *     description: Cập nhật thông tin loại sân.
 *     tags:
 *       - FieldType
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của loại sân
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123457
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFieldTypeRequest'
 *
 *     responses:
 *       200:
 *         description: Cập nhật loại sân thành công
 *
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 *       404:
 *         description: Không tìm thấy loại sân
 */

/**
 * @swagger
 * /api/field-types/{id}:
 *   delete:
 *     summary: Xóa loại sân
 *     description: Xóa một loại sân khỏi hệ thống.
 *     tags:
 *       - FieldType
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của loại sân
 *         schema:
 *           type: string
 *         example: 68a123456789abcdef123457
 *
 *     responses:
 *       200:
 *         description: Xóa loại sân thành công
 *
 *       404:
 *         description: Không tìm thấy loại sân
 *
 *       400:
 *         description: Không thể xóa loại sân
 */