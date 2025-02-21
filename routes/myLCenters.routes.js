import { Router } from "express";
import { getMyCenters } from "../controllers/myLCenters.controller.js";
import authentication from "../middlewares/authentication.js";

let route = Router();

route.get("/", authentication, getMyCenters);

export default route;
