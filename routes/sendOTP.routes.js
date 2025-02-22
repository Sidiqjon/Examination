import { Router } from "express";
import sendOtp from "../controllers/sendOTP.controller.js";

let sendOtpRoute = Router();

sendOtpRoute.post("/", sendOtp);

export default sendOtpRoute;

/**
 * @swagger
 * /api/send-otp:
 *   post:
 *     summary: 📩 Send OTP for Email Verification
 *     description: Sends a One-Time Password (OTP) to the user's registered email for account activation.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *                 description: Registered email address to send OTP.
 *     responses:
 *       200:
 *         description: ✅ OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "John, An OTP has been sent to your Email!"
 *                 otp:
 *                   type: string
 *                   example: "123456"
 *       400:
 *         description: ❌ Invalid email format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email format is incorrect! Format: 'example@example.com'"
 *       404:
 *         description: ❌ Account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No account found with the Email address you provided!"
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
