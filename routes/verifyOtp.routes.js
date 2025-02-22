import { Router } from "express";
import verifyOtp from "../controllers/verifyotp.controller.js";

let verifyOtpRoute = Router();

verifyOtpRoute.post("/", verifyOtp);

export default verifyOtpRoute;

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: ✅ Verify OTP for Email Activation
 *     description: Verifies the One-Time Password (OTP) sent to the user's email and activates the account.
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
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *                 description: Registered email address.
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: The One-Time Password sent to the email.
 *     responses:
 *       200:
 *         description: ✅ OTP verified successfully, account activated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully!"
 *       400:
 *         description: ❌ Invalid OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP!"
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
