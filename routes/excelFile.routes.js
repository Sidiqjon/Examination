import { Router } from "express";

import { exportUsersToExcel, exportLearningCentersToExcel } from "../controllers/excelFile.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let ExcelRoute = Router()

ExcelRoute.get("/users-excel", authentication, authorization(["ADMIN", "CEO"]), exportUsersToExcel);
ExcelRoute.get("/lc-excel", authentication, authorization(["ADMIN", "CEO"]), exportLearningCentersToExcel);

export default ExcelRoute
