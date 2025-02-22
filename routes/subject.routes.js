import { Router } from "express";
import {
  create,
  findAll,
  findOne,
  remove,
  Search,
  update,
} from "../controllers/subjects.controller.js";

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
 *   name: Subjects
 *   description: 🎓 Subject management
 */

/**
 * @swagger
 * /api/subjects/search:
 *   get:
 *     summary: 🔍 Search subjects
 *     tags: [Subjects]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter subjects by name (partial match)
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
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of subjects matching the criteria
 *       404:
 *         description: No subjects found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: 📚 Get all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: List of all subjects
 *       404:
 *         description: No subjects available
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: ➕ Create a new subject
 *     tags: [Subjects]
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
 *                 description: Subject name
 *               img:
 *                 type: string
 *                 description: Image URL
 *     responses:
 *       201:
 *         description: New subject created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Subject already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: 📖 Get a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject details
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/subjects/{id}:
 *   patch:
 *     summary: ✏️ Update a subject
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated subject name
 *               img:
 *                 type: string
 *                 description: Updated image URL
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subject not found
 *       409:
 *         description: Subject with the same name already exists
 *       500:
 *         description: Server error
 *
 */

/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: 🗑️ Delete a subject
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */


