import { Router } from "express";
import { create, findAll, findOne, remove, Search, update } from "../controllers/resources.controller.js";
import authentication from "../middlewares/authentication.js"

let route = Router()

route.get("/search", Search)
route.get("/", findAll)
route.get("/:id", findOne)
route.post("/", authentication, create)
route.patch("/:id", authentication, update)
route.delete("/:id", authentication, remove)

export default route

/**
 * @swagger
 * tags:
 *   name: Resources 📚
 *   description: API endpoints for managing learning resources
 */

/**
 * @swagger
 * /api/resources/search:
 *   get:
 *     summary: 🔍 Search for resources
 *     tags: [Resources 📚]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by resource name
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved the resources
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: 📄 Get all resources
 *     tags: [Resources 📚]
 *     responses:
 *       200:
 *         description: List of all resources
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: ➕ Create a new resource
 *     tags: [Resources 📚]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, img, media, description, createdBy, categoryId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "React Guide"
 *               img:
 *                 type: string
 *                 example: "image.jpg"
 *               media:
 *                 type: string
 *                 example: "video.mp4"
 *               description:
 *                 type: string
 *                 example: "Comprehensive React tutorial"
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Successfully created the resource
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     summary: 📌 Get a single resource by ID
 *     tags: [Resources 📚]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the resource
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   patch:
 *     summary: ✏️ Update a resource
 *     tags: [Resources 📚]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               img:
 *                 type: string
 *               media:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully updated the resource
 *       403:
 *         description: Unauthorized to update this resource
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: 🗑️ Delete a resource
 *     tags: [Resources 📚]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Successfully deleted the resource
 *       403:
 *         description: Unauthorized to delete this resource
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
