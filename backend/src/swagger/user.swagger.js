/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Đăng ký, đăng nhập và thông tin tài khoản
 *
 *   - name: User
 *     description: Quản lý người dùng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6a743d62d4950f51abb6c862
 *
 *         fullName:
 *           type: string
 *           example: Nguyen Van A
 *
 *         phone:
 *           type: string
 *           example: "0912345678"
 *
 *         email:
 *           type: string
 *           format: email
 *           example: a@gmail.com
 *
 *         role:
 *           type: string
 *           enum:
 *             - customer
 *             - staff
 *             - admin
 *           example: customer
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-06T07:53:06.515Z"
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-06T07:53:06.515Z"
 *
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           example: Nguyen Van A
 *
 *         phone:
 *           type: string
 *           example: "0912345678"
 *
 *         email:
 *           type: string
 *           format: email
 *           example: a@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - phone
 *         - password
 *       properties:
 *         phone:
 *           type: string
 *           example: "0912345678"
 *
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *
 *     CreateStaffRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           example: Nguyen Van B
 *
 *         phone:
 *           type: string
 *           example: "0987654321"
 *
 *         email:
 *           type: string
 *           format: email
 *           example: staff@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản Customer
 *     description: >
 *       Đăng ký tài khoản người dùng mới.
 *       Người dùng đăng ký thông thường sẽ được tạo với role customer.
 *       Người dùng không được tự đăng ký với role staff hoặc admin.
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng ký thành công
 *
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc số điện thoại/email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Số điện thoại đã tồn tại
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     description: >
 *       Đăng nhập bằng số điện thoại và mật khẩu.
 *       API trả về JWT token chứa id và role của người dùng.
 *
 *       Có thể đăng nhập với cả 3 role:
 *       customer, staff và admin.
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *
 *       400:
 *         description: Tài khoản không tồn tại hoặc sai mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sai mật khẩu
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Xem thông tin tài khoản hiện tại
 *     description: >
 *       Lấy thông tin người dùng hiện tại dựa trên JWT token.
 *       API hỗ trợ cả customer, staff và admin.
 *     tags:
 *       - Auth
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lấy thông tin tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: Chưa đăng nhập hoặc JWT token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */

/**
 * @swagger
 * /api/users/staff:
 *   post:
 *     summary: Tạo tài khoản Staff
 *     description: >
 *       Admin tạo tài khoản Staff.
 *       Chỉ người dùng có role admin mới được phép sử dụng API này.
 *       Role của tài khoản được tạo sẽ tự động là staff.
 *     tags:
 *       - User
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStaffRequest'
 *
 *     responses:
 *       201:
 *         description: Tạo tài khoản Staff thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Tạo tài khoản Staff thành công
 *
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc số điện thoại đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Số điện thoại đã tồn tại
 *
 *       401:
 *         description: Chưa đăng nhập hoặc JWT token không hợp lệ
 *
 *       403:
 *         description: Người dùng không có quyền tạo Staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Forbidden
 */