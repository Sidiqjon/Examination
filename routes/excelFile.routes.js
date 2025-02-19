import { Router } from "express";

import { exportUsersToExcel } from "../controllers/excelFile.controller.js";

let userExcelRoute = Router()

userExcelRoute.get("/", exportUsersToExcel);

export default userExcelRoute
