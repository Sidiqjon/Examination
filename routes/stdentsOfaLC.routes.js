import { Router } from "express";
import getStudents from "../controllers/studentsOfaLC.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"
 
let studentsOfaLCRoute = Router();

studentsOfaLCRoute.get("/:id", authentication, authorization(["ADMIN", "CEO"]), getStudents);

export default studentsOfaLCRoute;  

/**
 * @swagger
 * tags:
 *   name: Learning Center Students
 *   description: API to fetch students enrolled in a learning center
 */

/**
 * @swagger
 * /studentsOfaLC/{id}:
 *   get:
 *     summary: Get students of a learning center
 *     description: Fetches a list of students enrolled in a specific learning center. Only accessible by ADMIN and CEO roles. A CEO can only access their own learning center.
 *     tags: [Learning Center Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the learning center
 *     responses:
 *       200:
 *         description: Successfully retrieved students
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
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         example: 5
 *                       learningCenterId:
 *                         type: integer
 *                         example: 3
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           firstName:
 *                             type: string
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             example: Doe
 *                           email:
 *                             type: string
 *                             example: johndoe@example.com
 *       403:
 *         description: Forbidden - CEO is not authorized to access this learning center
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not authorized to access this learning center
 *       404:
 *         description: No students found or learning center not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Learning center not found
 *                 message:
 *                   type: string
 *                   example: No students found for this learning center
 *       500:
 *         description: Server error
 */

