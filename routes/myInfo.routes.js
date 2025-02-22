import { Router } from "express";
import { getMyInfo } from "../controllers/myInfo.controller.js";
import authentication from "../middlewares/authentication.js";

let route = Router();

route.get("/", authentication, getMyInfo);

export default route;

/**
 * @swagger
 * /api/my-info:
 *   get:
 *     summary: 🔍 Get My Info
 *     description: Retrieve detailed information about the authenticated user, including comments, likes, enrollments, and resources.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+998900000000"
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Resource Name"
 *                           img:
 *                             type: string
 *                             example: "resource.jpg"
 *                           media:
 *                             type: string
 *                             example: "resource.mp4"
 *                           description:
 *                             type: string
 *                             example: "Resource description"
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           comment:
 *                             type: string
 *                             example: "Great learning center!"
 *                           star:
 *                             type: integer
 *                             example: 5
 *                           learningCenterId:
 *                             type: integer
 *                             example: 2
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           learningCenterId:
 *                             type: integer
 *                             example: 2
 *                     userEnrolments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           learningCenterId:
 *                             type: integer
 *                             example: 3
 *                           branchId:
 *                             type: integer
 *                             example: 1
 *                           branch:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Main Branch"
 *                           learningCenter:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 3
 *                               name:
 *                                 type: string
 *                                 example: "Tech Learning Center"
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
