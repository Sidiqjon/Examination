import { Router } from "express";
import {
  create,
  findAll,
  findOne,
  remove,
  Search,
  update,
} from "../controllers/profession.controller.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

let route = Router();

route.get("/search", Search);
route.get("/", findAll);
route.get("/:id", findOne);
route.post("/", authentication, authorization(["ADMIN"]), create);
route.patch("/:id", authentication, authorization(["ADMIN"]), update);
route.delete("/:id", authentication, authorization(["ADMIN"]), remove);

export default route;

/**
 * @swagger
 * tags:
 *   name: Professions
 *   description: Profession management
 */

/**
 * @swagger
 * /api/professions:
 *   get:
 *     summary: Get all professions
 *     tags: [Professions]
 *     responses:
 *       200:
 *         description: Successfully retrieved all professions
 *       404:
 *         description: Professions not found
 */

/**
 * @swagger
 * /api/professions/{id}:
 *   get:
 *     summary: Get a profession by ID
 *     tags: [Professions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The profession ID
 *     responses:
 *       200:
 *         description: Successfully retrieved profession
 *       404:
 *         description: Profession not found
 */

/**
 * @swagger
 * /api/professions:
 *   post:
 *     summary: Create a new profession
 *     tags: [Professions]
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
 *                 example: Software Engineer
 *               img:
 *                 type: string
 *                 example: "image.jpg"
 *     responses:
 *       201:
 *         description: Profession created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Profession already exists
 */

/**
 * @swagger
 * /api/professions/{id}:
 *   patch:
 *     summary: Update a profession
 *     tags: [Professions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The profession ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Data Scientist
 *               img:
 *                 type: string
 *                 example: "new-image.jpg"
 *     responses:
 *       200:
 *         description: Profession updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Profession not found
 */

/**
 * @swagger
 * /api/professions/{id}:
 *   delete:
 *     summary: Delete a profession
 *     tags: [Professions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The profession ID
 *     responses:
 *       200:
 *         description: Profession deleted successfully
 *       404:
 *         description: Profession not found
 */

/**
 * @swagger
 * /api/professions/search:
 *   get:
 *     summary: Search professions with filters and pagination
 *     tags: [Professions]
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
 *         description: Number of results per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sorting order
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *       404:
 *         description: No professions found matching criteria
 */
