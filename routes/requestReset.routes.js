import { Router } from "express";
import { reqReset } from "../controllers/resetpwd.controller.js";

let reqResetRoute = Router();

reqResetRoute.post("/", reqReset);

export default reqResetRoute;

/**
 * @swagger
 * /api/request-reset:
 *   post:
 *     summary: 📩 Request Password Reset (Send OTP)
 *     description: Sends a password reset OTP to the user's registered email.
 *     tags:
 *       - Password Reset
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
 *                 example: "user@example.com"
 *                 description: The email of the user requesting a password reset.
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
 *                   example: "John, an OTP has been sent to your email. Please check and confirm it!"
 *                 otp:
 *                   type: string
 *                   example: "123456"
 *       404:
 *         description: ❌ No account found with the provided email.
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
