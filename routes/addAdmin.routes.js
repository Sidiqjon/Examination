import { Router } from "express";
import createAdmin from "../controllers/addAdmin.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let addAdminRoute = Router();

addAdminRoute.post("/", authentication, authorization(["admin"]), createAdmin);

export default addAdminRoute;
