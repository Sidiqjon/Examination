import { Router } from "express";
import Login from "../controllers/login.controller.js";

let loginRoute = Router();

loginRoute.post("/", Login);

export default loginRoute;

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: 🔑 User Login
 *     description: Authenticates a user with email and password, checks account status, and returns access & refresh tokens.
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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *                 description: Registered email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "#Abcd123$"
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: ✅ Successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in successfully!"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5c..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5c..."
 *       400:
 *         description: ❌ Invalid credentials or account not active.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Credentials!"
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
