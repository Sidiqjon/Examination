import { Router } from "express";
import { getLCsByStars, getLCsByComments, getLCsByLikes } from "../controllers/lcRating.controller.js";

const route = Router();

route.get("/stars", getLCsByStars);
route.get("/comments", getLCsByComments);
route.get("/likes", getLCsByLikes);

export default route

/**
 * @swagger
 * tags:
 *   - name: Learning Center Ratings 🏆
 *     description: Endpoints for retrieving learning centers based on ratings, comments, and likes.
 */

/**
 * @swagger
 * /api/lc-ratings/stars:
 *   get:
 *     summary: Get learning centers sorted by average stars ⭐
 *     description: Retrieves learning centers sorted by their average star rating.
 *     tags: [Learning Center Ratings 🏆]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sorting order (ascending or descending).
 *     responses:
 *       200:
 *         description: Successfully retrieved learning centers sorted by average stars.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       averageStars:
 *                         type: number
 *                         format: float
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/lc-ratings/comments:
 *   get:
 *     summary: Get learning centers sorted by most comments 💬
 *     description: Retrieves learning centers ranked by the total number of comments.
 *     tags: [Learning Center Ratings 🏆]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sorting order (ascending or descending).
 *     responses:
 *       200:
 *         description: Successfully retrieved learning centers sorted by comment count.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       totalComments:
 *                         type: integer
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/lc-ratings/likes:
 *   get:
 *     summary: Get learning centers sorted by most likes ❤️
 *     description: Retrieves learning centers ranked by the total number of likes.
 *     tags: [Learning Center Ratings 🏆]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sorting order (ascending or descending).
 *     responses:
 *       200:
 *         description: Successfully retrieved learning centers sorted by like count.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       totalLikes:
 *                         type: integer
 *       500:
 *         description: Server error.
 */
