import { Router } from "express";
import { getMyCenters } from "../controllers/myLCenters.controller.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

let route = Router();

route.get("/", authentication, authorization(["ADMIN", "CEO"]), getMyCenters);

export default route;

/**
 * @swagger
 * /api/my-learning-centers:
 *   get:
 *     summary: "🔍 Get Learning Centers Created by Current User"
 *     description: "Fetch all learning centers created by the authenticated user. Only ADMIN and CEO roles can access this route."
 *     tags:
 *       - Learning Centers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "✅ Successfully retrieved learning centers."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/LearningCenter"
 *       404:
 *         description: "⚠️ No learning centers found for this user."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Learning centers not found!"
 *       401:
 *         description: "⛔ Unauthorized! Token is missing or invalid."
 *       403:
 *         description: "🚫 Forbidden! Only ADMIN and CEO can access this route."
 *       500:
 *         description: "❌ Internal server error."
 */
