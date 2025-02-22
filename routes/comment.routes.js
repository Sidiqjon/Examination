import { Router } from "express";
import { findAll, Search, findOne, create, update, remove } from "../controllers/comment.controller.js";
import authentication from "../middlewares/authentication.js"

const router = Router();

router.get("/search", Search);  
router.get("/", findAll);  
router.get("/:id", findOne);  
router.post("/",authentication, create);  
router.patch("/:id",authentication, update);  
router.delete("/:id",authentication, remove);  

export default router;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API endpoints for managing comments
 */

/**
 * @swagger
 * /api/comments/search:
 *   get:
 *     summary: Search comments with filters and pagination
 *     tags: [Comments]
 *     parameters:
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
 *         description: Successfully retrieved comments
 *       404:
 *         description: No comments found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Successfully retrieved all comments
 *       404:
 *         description: No comments found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Successfully retrieved the comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment, star, learningCenterId]
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The comment text
 *               star:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5.0
 *                 description: Star rating (0-5)
 *               learningCenterId:
 *                 type: integer
 *                 description: ID of the learning center
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error or invalid learning center ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Updated comment text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Unauthorized to update this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
