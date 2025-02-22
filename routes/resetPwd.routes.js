import { Router } from "express";
import { resPassword } from "../controllers/resetpwd.controller.js";

let resetPwdRoute = Router();

resetPwdRoute.post("/", resPassword);

export default resetPwdRoute;

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: 🔑 Reset Password
 *     description: Resets the user's password using the provided new password.
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
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: The email of the user resetting their password.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "#Abcd123$"
 *                 description: The new password to set (must be strong).
 *     responses:
 *       200:
 *         description: ✅ Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your password has been updated successfully!"
 *       400:
 *         description: ❌ Weak password or update error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please, USE a stronger password for your safety! For example: #Abcd123$"
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
