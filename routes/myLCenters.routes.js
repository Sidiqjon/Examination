import { Router } from "express";
import { getMyCenters } from "../controllers/myLCenters.controller.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

let route = Router();

route.get("/", authentication, authorization(["ADMIN", "CEO"]), getMyCenters);

export default route;

