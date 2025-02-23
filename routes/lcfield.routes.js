import { Router } from "express";
import { create, remove } from "../controllers/lcfield.controller.js"
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let route = Router()

route.post("/", authentication, authorization(["ADMIN", "CEO"]), create)
route.delete("/del", authentication, authorization(["ADMIN", "CEO"]), remove)

export default route

/**
 * @swagger
 * tags:
 *   name: LearningCenterField
 *   description: 🏫 Manage Learning Center Fields
 */

/**
 * @swagger
 * /api/lcfields:
 *   post:
 *     summary: ➕ Add fields to a Learning Center
 *     description: Assign multiple fields to a specific learning center. Only accessible by ADMIN or CEO.
 *     tags: [LearningCenterField]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learningCenterId
 *               - fieldId
 *             properties:
 *               learningCenterId:
 *                 type: integer
 *                 example: 1
 *               fieldId:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 5]
 *     responses:
 *       201:
 *         description: Fields successfully assigned to the Learning Center.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Fields added successfully"
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "fieldId must be an array of numbers"
 *       403:
 *         description: Unauthorized - User does not have permission to add fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You are not authorized to add fields for this LearningCenter!"
 *       404:
 *         description: Learning Center not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "LearningCenter Not Found!"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/lcfields/del:
 *   delete:
 *     summary: ❌ Remove fields from a Learning Center
 *     description: Remove one or more fields from a specific learning center. Only accessible by ADMIN or CEO.
 *     tags: [LearningCenterField]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learningCenterId
 *               - fieldId
 *             properties:
 *               learningCenterId:
 *                 type: integer
 *                 example: 1
 *               fieldId:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3]
 *     responses:
 *       200:
 *         description: Fields successfully removed from the Learning Center.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Fields deleted successfully"
 *       403:
 *         description: Unauthorized - User does not have permission to remove fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You are not authorized to delete fields for this LearningCenter!"
 *       404:
 *         description: Learning Center not found or no matching fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No matching Learning Center Fields found for deletion"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
