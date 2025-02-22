import { Router } from "express";
import { create, findAll, findOne, remove, Search, update } from "../controllers/resourcesCategory.controller.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

let route = Router()

route.get("/search", Search)
route.get("/", findAll)
route.get("/:id", findOne)
route.post("/", authentication, authorization(["ADMIN"]), create)
route.patch("/:id", authentication, authorization(["ADMIN"]), update)
route.delete("/:id", authentication, authorization(["ADMIN"]), remove)

export default route
/**
 * @swagger
 * tags:
 *   name: ResourceCategory
 *   description: Resource Category management API
 */

/**
 * @swagger
 * /api/resource-category/search:
 *   get:
 *     summary: Search resource categories 🔎
 *     tags: [ResourceCategory]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for category name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resource-category:
 *   get:
 *     summary: Get all resource categories 📂
 *     tags: [ResourceCategory]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resource-category/{id}:
 *   get:
 *     summary: Get a single resource category by ID 🆔
 *     tags: [ResourceCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource category ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resource-category:
 *   post:
 *     summary: Create a new resource category ➕
 *     tags: [ResourceCategory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - img
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Programming"
 *               img:
 *                 type: string
 *                 example: "category.png"
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Category with this name already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resource-category/{id}:
 *   patch:
 *     summary: Update a resource category ✏️
 *     tags: [ResourceCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource category ID
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
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category with this name already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/resource-category/{id}:
 *   delete:
 *     summary: Delete a resource category 🗑️
 *     tags: [ResourceCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource category ID
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
