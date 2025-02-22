import { Router } from "express";
import { create, findAll, findOne, remove, Search, update } from "../controllers/learningcenter.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let route = Router()

route.get("/search", Search)
route.get("/", findAll)
route.get("/:id", findOne)
route.post("/", authentication, authorization(["ADMIN", "CEO"]), create)
route.patch("/:id", authentication, authorization(["ADMIN", "CEO"]), update)
route.delete("/:id", authentication, authorization(["ADMIN", "CEO"]), remove)

export default route

/**
 * @swagger
 * tags:
 *   name: learningcenter
 *   description: 📚 Learning center management
 */

/**
 * @swagger
 * /api/learning-centers/search:
 *   get:
 *     summary: 🔍 Search learning centers
 *     tags: [learningcenter]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by learning center name
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: integer
 *         description: Filter by region ID
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: integer
 *         description: Filter by user who created the center
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of learning centers matching filters
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /api/learning-centers:
 *   get:
 *     summary: 📄 Get all learning centers
 *     tags: [learningcenter]
 *     responses:
 *       200:
 *         description: List of all learning centers
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/learning-centers:
 *   post:
 *     summary: ➕ Create a new learning center
 *     tags: [learningcenter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phoneNumber, img, address, regionId, createdBy]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Code Academy"
 *               phoneNumber:
 *                 type: string
 *                 example: "+998901234567"
 *               img:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Tashkent"
 *               regionId:
 *                 type: integer
 *                 example: 1
 *               branchNumber:
 *                 type: integer
 *                 example: 2
 *               createdBy:
 *                 type: integer
 *                 example: 5
 *               lcfield:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Learning center created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (only ADMIN or CEO)
 */

/**
 * @swagger
 * /api/learning-centers/{id}:
 *   get:
 *     summary: 📌 Get a learning center by ID
 *     tags: [learningcenter]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning center ID
 *     responses:
 *       200:
 *         description: Learning center details
 *       404:
 *         description: Learning center not found
 */ 

/**
 * @swagger
 * /api/learning-centers/{id}:
 *   patch:
 *     summary: ✏️ Update a learning center
 *     tags: [learningcenter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning center ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Academy"
 *               phoneNumber:
 *                 type: string
 *                 example: "+998901234567"
 *               img:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *               address:
 *                 type: string
 *                 example: "456 Elm Street, Tashkent"
 *               regionId:
 *                 type: integer
 *                 example: 2
 *               branchNumber:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Learning center updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (only ADMIN or CEO)
 *       404:
 *         description: Learning center not found
 */

/**
 * @swagger
 * /api/learning-centers/{id}:
 *   delete:
 *     summary: 🗑️ Delete a learning center
 *     tags: [learningcenter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning center ID
 *     responses:
 *       200:
 *         description: Learning center deleted successfully
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (only ADMIN or CEO)
 *       404:
 *         description: Learning center not found
 */

