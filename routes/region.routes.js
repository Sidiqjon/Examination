import { Router } from "express";
import { findAll, Search, findOne, create, update, remove } from "../controllers/region.controller.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get("/search", Search);
router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", authentication, authorization(["ADMIN"]), create);          
router.patch("/:id", authentication, authorization(["ADMIN"]), update);
router.delete("/:id", authentication, authorization(["ADMIN"]), remove);

export default router;

/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: 🌍 Region management
 */

/**
 * @swagger
 * /api/regions/search:
 *   get:
 *     summary: 🔍 Search regions
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of items per page (default is 10)
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
 *         description: Sort order (ASC or DESC)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by region name (partial match)
 *     responses:
 *       200:
 *         description: List of regions with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Region'
 *       404:
 *         description: No matching regions found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: 📜 Get all regions
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: List of all regions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Region'
 *       404:
 *         description: No regions found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/regions:
 *   post:
 *     summary: ✨ Create a new region
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegionInput'
 *     responses:
 *       201:
 *         description: Region created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Region'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Region with this name already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/regions/{id}:
 *   get:
 *     summary: 🏙️ Get a specific region
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Region'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Region not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/regions/{id}:
 *   patch:
 *     summary: ✏️ Update a region
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegionPatchInput'
 *     responses:
 *       200:
 *         description: Region updated successfully
 *       400:
 *         description: Validation error or invalid ID format
 *       404:
 *         description: Region not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/regions/{id}:
 *   delete:
 *     summary: 🗑️ Delete a region
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Region not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Region:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Tashkent"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RegionInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           pattern: ^[a-zA-Z0-9\s]+$
 *           example: "Samarkand"
 *     RegionPatchInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           pattern: ^[a-zA-Z0-9\s]+$
 *           example: "Bukhara"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
