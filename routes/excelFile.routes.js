import { Router } from "express";

import { exportUsersToExcel, exportLearningCentersToExcel } from "../controllers/excelFile.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let ExcelRoute = Router()

ExcelRoute.get("/users-excel", authentication, authorization(["ADMIN"]), exportUsersToExcel);
ExcelRoute.get("/lc-excel", authentication, authorization(["ADMIN", "CEO"]), exportLearningCentersToExcel);

export default ExcelRoute

/**
 * @swagger
 * tags:
 *   - name: Excel Exports 📂
 *     description: Endpoints to export users and learning centers to Excel files.
 */

/**
 * @swagger
 * /api/excel/users-excel:
 *   get:
 *     summary: Export users to Excel 📄
 *     description: Generates and downloads an Excel file containing user data.
 *     tags: [Excel Exports 📂]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully generated the Excel file.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Unauthorized, only ADMIN can access.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/excel/lc-excel:
 *   get:
 *     summary: Export learning centers to Excel 🏫📄
 *     description: Generates and downloads an Excel file containing learning center data.
 *     tags: [Excel Exports 📂]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully generated the Excel file.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Unauthorized, only ADMIN or CEO can access.
 *       500:
 *         description: Server error.
 */
