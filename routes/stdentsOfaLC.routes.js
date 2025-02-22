import { Router } from "express";
import getStudents from "../controllers/studentsOfaLC.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"
 
let studentsOfaLCRoute = Router();

studentsOfaLCRoute.get("/:id", authentication, authorization(["ADMIN", "CEO"]), getStudents);

export default studentsOfaLCRoute;  
