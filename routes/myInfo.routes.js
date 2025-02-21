import { Router } from "express";
import { getMyInfo } from "../controllers/myInfo.controller.js";
import authentication from "../middlewares/authentication.js";

let route = Router();

route.get("/", authentication, getMyInfo);

export default route;
