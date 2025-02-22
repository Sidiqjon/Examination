import { Router } from "express";
import createAdmin from "../controllers/addAdmin.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let addAdminRoute = Router();

addAdminRoute.post("/", authentication, authorization(["ADMIN"]), createAdmin);

export default addAdminRoute;

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: 🔑 Add Admin
 *     description: Create a new admin account. Only an existing admin can perform this action.
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - email
 *               - img
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "+998901234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               img:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               password:
 *                 type: string
 *                 example: "SecurePass@123"
 *               role:
 *                 type: string
 *                 enum: [ADMIN]
 *                 example: "ADMIN"
 *     responses:
 *       201:
 *         description: Admin created successfully, OTP sent to email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "John, You registered successfully as an Admin! An OTP has been sent to your Email!"
 *                 otp:
 *                   type: string
 *                   example: "123456"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or role mismatch.
 *       409:
 *         description: Email already exists.
 *       503:
 *         description: Email service unavailable.
 */
