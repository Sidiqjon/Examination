import { Router } from "express";
import { getAllCeo } from "../controllers/user.controller.js";

let getAllCeoRoute = Router();

getAllCeoRoute.get("/", getAllCeo);

export default getAllCeoRoute;

/**
 * @swagger
 * /api/ceos:
 *   get:
 *     summary: 👨‍💼 Get All CEOs
 *     description: Retrieve a list of all users with the role "CEO". Supports filtering, sorting, and pagination.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (optional).
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page (optional).
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filter by first name (optional).
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filter by last name (optional).
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by (optional).
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order (ascending or descending, optional).
 *     responses:
 *       200:
 *         description: List of all CEOs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 take:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       role:
 *                         type: string
 *                         example: "CEO"
 *       404:
 *         description: No CEOs found.
 *       500:
 *         description: Internal server error.
 */
