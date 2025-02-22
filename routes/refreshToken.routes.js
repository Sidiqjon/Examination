import { Router } from "express";
import refreshToken from "../controllers/refreshToken.controller.js";

let refreshTokenRoute = Router();

refreshTokenRoute.post("/", refreshToken);

export default refreshTokenRoute;

/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     summary: 🔄 Refresh Access Token
 *     description: Generates a new access token using a valid refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 description: A valid refresh token issued during login.
 *     responses:
 *       200:
 *         description: ✅ Access token successfully refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your access token has been refreshed!"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: ❌ Invalid or expired refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something is WRONG with your REFRESH TOKEN!"
 *                 error:
 *                   type: string
 *                   example: "jwt expired"
 *       404:
 *         description: ❌ User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found with the refresh token you provided!"
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
