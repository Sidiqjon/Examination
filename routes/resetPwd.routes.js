import { Router } from "express";
import { resPassword } from "../controllers/resetpwd.controller.js";

let resetPwdRoute = Router();

resetPwdRoute.post("/", resPassword);

export default resetPwdRoute;

