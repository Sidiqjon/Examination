import { Router } from "express";
import { create, findAll, findOne, remove, Search, update } from "../controllers/field.controller.js";
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
 *   name: Fields
 *   description: 🏷️ Field management
 */

/**
 * @swagger
 * /api/fields/search:
 *   get:
 *     summary: 🔍 Search for fields
 *     description: Retrieve a list of fields based on search criteria.
 *     tags: [Fields]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by field name
 *       - in: query
 *         name: professionId
 *         schema:
 *           type: integer
 *         description: Filter by profession ID
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: integer
 *         description: Filter by subject ID
 *     responses:
 *       200:
 *         description: List of matching fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/fields:
 *   get:
 *     summary: 📜 Get all fields
 *     description: Retrieve all fields with optional pagination.
 *     tags: [Fields]
 *     responses:
 *       200:
 *         description: List of fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/fields/{id}:
 *   get:
 *     summary: 📄 Get field by ID
 *     description: Retrieve details of a single field by ID.
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Field details
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/fields:
 *   post:
 *     summary: ✨ Create a new field
 *     description: Only admins can create new fields.
 *     tags: [Fields]
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
 *                 example: "Computer Science"
 *               img:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               professionId:
 *                 type: integer
 *                 nullable: true
 *               subjectId:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Field created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/fields/{id}:
 *   patch:
 *     summary: 🛠️ Update a field
 *     description: Only admins can update field details (`name` and `img` only).
 *     tags: [Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Software Engineering"
 *                 description: Updated field name.
 *               img:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *                 description: Updated field image URL.
 *     responses:
 *       200:
 *         description: ✅ Field updated successfully.
 *       400:
 *         description: ❌ Validation error.
 *       403:
 *         description: 🚫 Unauthorized access (admin only).
 *       404:
 *         description: 🔍 Field not found.
 *       500:
 *         description: ⚠️ Server error.
 */


/**
 * @swagger
 * /api/fields/{id}:
 *   delete:
 *     summary: 🗑️ Delete a field
 *     description: Only admins can delete a field.
 *     tags: [Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Field deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */
