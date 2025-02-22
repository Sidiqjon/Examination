import { Router } from "express";
import { getAll, getOne, update, remove } from "../controllers/user.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let userRoute = Router();

userRoute.get("/", authentication, authorization(["ADMIN", "CEO", "USER"]), getAll);
userRoute.get("/:id",authentication, authorization(["ADMIN"]), getOne);
userRoute.patch("/:id", authentication, authorization(["ADMIN", "CEO", "USER"]), update);
userRoute.delete("/:id", authentication, authorization(["ADMIN", "CEO", "USER"]), remove);

export default userRoute;

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 👥 Get All Users
 *     description: Retrieve a list of users with optional filters and pagination.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of users per page.
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filter by first name.
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filter by last name.
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Filter by phone number.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Filter by email address.
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, CEO, USER]
 *         description: Filter by user role.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by user status.
 *     responses:
 *       200:
 *         description: ✅ List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 take:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: ❌ No users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found."
 *       500:
 *         description: ❌ Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *
 * /api/users/{id}:
 *   get:
 *     summary: 🔍 Get a Single User
 *     description: Retrieve details of a specific user by ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: ✅ User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: ❌ User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: ❌ Internal server error.
 *
 *   patch:
 *     summary: ✏️ Update a User
 *     description: Update user details. Only admins can update role and status.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: ✅ User updated successfully.
 *       400:
 *         description: ❌ Invalid data format.
 *       404:
 *         description: ❌ User not found.
 *       500:
 *         description: ❌ Internal server error.
 *
 *   delete:
 *     summary: 🗑️ Delete a User
 *     description: Delete a user by ID. Admins can delete any user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: ✅ User deleted successfully.
 *       400:
 *         description: ❌ Cannot delete another user.
 *       404:
 *         description: ❌ User not found.
 *       500:
 *         description: ❌ Internal server error.
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         phoneNumber:
 *           type: string
 *           example: "+998900000000"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         role:
 *           type: string
 *           enum: [ADMIN, CEO, USER]
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserUpdate:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Jane"
 *         lastName:
 *           type: string
 *           example: "Smith"
 *         phoneNumber:
 *           type: string
 *           example: "+998911223344"
 *         img:
 *           type: string
 *           example: "profile.jpg"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 */
