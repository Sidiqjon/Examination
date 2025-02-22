import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/branch.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let route = Router();

route.get("/", findAll);
route.get("/:id", findOne);
route.post("/", authentication, authorization(["ADMIN", "CEO"]), create);
route.patch("/:id", authentication, authorization(["ADMIN", "CEO"]), update);
route.delete("/:id", authentication, authorization(["ADMIN", "CEO"]), remove);

export default route;

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Branch management API 🏢
 */

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get all branches 📍
 *     description: Retrieve a list of all branches with optional filtering, pagination, and sorting.
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of records per page.
 *     responses:
 *       200:
 *         description: A list of branches.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/branches/{id}:
 *   get:
 *     summary: Get a single branch by ID 🔍
 *     description: Retrieve details of a specific branch.
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID.
 *     responses:
 *       200:
 *         description: Branch details.
 *       404:
 *         description: Branch not found.
 */

/**
 * @swagger
 * /api/branches:
 *   post:
 *     summary: Create a new branch ➕
 *     description: Admins and CEOs can create a new branch.
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 example: "+998901234567"
 *               img:
 *                 type: string
 *               address:
 *                 type: string
 *               regionId:
 *                 type: integer
 *               learningCenterId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Branch created successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Unauthorized action.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/branches/{id}:
 *   patch:
 *     summary: Update a branch ✏️
 *     description: Admins and CEOs can update branch details.
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               img:
 *                 type: string
 *               address:
 *                 type: string
 *               regionId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Branch updated successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Unauthorized action.
 *       404:
 *         description: Branch not found.
 */

/**
 * @swagger
 * /api/branches/{id}:
 *   delete:
 *     summary: Delete a branch ❌
 *     description: Admins and CEOs can delete a branch.
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID.
 *     responses:
 *       200:
 *         description: Branch deleted successfully.
 *       403:
 *         description: Unauthorized action.
 *       404:
 *         description: Branch not found.
 */
