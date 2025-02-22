import { Router } from "express";
import { create, remove } from "../controllers/likes.controller.js";
import authentication from "../middlewares/authentication.js"

let route = Router()

route.post("/", authentication, create)
route.delete("/:id", authentication, remove)

export default route

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: 🩷 Like management APIs
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: ❤️ Like a Learning Center
 *     description: Users can like a learning center. A user can only like once per learning center.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learningCenterId
 *             properties:
 *               learningCenterId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: 🎉 Like added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liked Successfully"
 *       400:
 *         description: 🚨 Validation error
 *       404:
 *         description: ❌ User or Learning Center not found
 *       409:
 *         description: ❗ User has already liked this Learning Center
 *       500:
 *         description: 🔥 Internal server error
 */

/**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     summary: 💔 Unlike a Learning Center
 *     description: Users can remove their like from a learning center.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the like to remove
 *     responses:
 *       200:
 *         description: ✅ Like removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Like Deleted Successfully"
 *       403:
 *         description: ❌ Forbidden - User can't delete someone else's like
 *       404:
 *         description: 🔍 Like not found
 *       500:
 *         description: 🔥 Internal server error
 */
