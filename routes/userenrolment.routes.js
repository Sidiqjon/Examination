import { Router } from "express";
import {create, remove } from "../controllers/userenrolment.controller.js";
import authentication from "../middlewares/authentication.js"

const router = Router();

router.post("/",authentication, create);  
router.delete("/:id",authentication, remove);  

export default router;

/**
 * @swagger
 * tags:
 *   name: User Enrolments
 *   description: API for user enrolment management
 */

/**
 * @swagger
 * /userenrolments:
 *   post:
 *     summary: Register a user in a learning center or branch
 *     description: Allows a user to enroll in a learning center or a branch. Users cannot enroll in both at the same time.
 *     tags: [User Enrolments]
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
 *                 description: ID of the learning center the user is enrolling in
 *                 example: 3
 *               branchId:
 *                 type: integer
 *                 description: ID of the branch the user is enrolling in (optional)
 *                 example: 2
 *     responses:
 *       201:
 *         description: User enrolment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Enrolment Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     learningCenterId:
 *                       type: integer
 *                       example: 3
 *                     branchId:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Validation error (missing or incorrect fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Provide either branchId or learningCenterId, not both.
 *       404:
 *         description: Learning center or branch not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Learning Center does not exist
 *       409:
 *         description: User is already enrolled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You have previously registered with this learning center.
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /userenrolments/{id}:
 *   delete:
 *     summary: Remove a user enrolment
 *     description: Deletes a user enrolment. Only the enrolled user or an admin can delete it.
 *     tags: [User Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user enrolment to delete
 *     responses:
 *       200:
 *         description: User enrolment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Enrolment Deleted Successfully
 *       403:
 *         description: Forbidden - User does not have permission to delete this enrolment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not allowed to delete this enrolment.
 *       404:
 *         description: Enrolment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: UserEnrolment Not Found
 *       500:
 *         description: Server error
 */

