import { Router } from "express";
import Register from "../controllers/register.controller.js";

let registerRoute = Router();

registerRoute.post("/", Register);

export default registerRoute;

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: 🔐 Register a new user
 *     description: Registers a new user, validates input fields, encrypts password, and sends an OTP for email verification.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - img
 *               - password
 *               - phoneNumber
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *                 description: User's first name (min. 2 characters, only letters).
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *                 description: User's last name (min. 2 characters, only letters).
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *                 description: Valid email address.
 *               img:
 *                 type: string
 *                 format: img
 *                 example: "example.png"
 *                 description: User's img.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: #Abcd123$
 *                 description: Strong password with uppercase, lowercase, numbers, and special characters.
 *               phoneNumber:
 *                 type: string
 *                 example: +998900000000
 *                 description: Valid phone number format.
 *               role:
 *                 type: string
 *                 enum: ["USER", "CEO"]
 *                 default: "USER"
 *                 description: Role of the user (ADMIN registration is restricted).
 *     responses:
 *       201:
 *         description: ✅ User registered successfully. OTP sent to email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "John, You registered successfully! An OTP has been sent to your Email!"
 *                 otp:
 *                   type: string
 *                   example: "123456"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+998900000000"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *       400:
 *         description: ❌ Validation error (invalid input format).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email format is incorrect! Format: 'example@example.com'"
 *       409:
 *         description: ❌ Email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This email has already been taken!"
 *       503:
 *         description: ❌ Email service unavailable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email service is unavailable, please try again later."
 *       500:
 *         description: ❌ Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
