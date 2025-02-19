import { Router } from "express";
import { reqReset } from "../controllers/resetpwd.controller.js";

let reqResetRoute = Router();

reqResetRoute.post("/", reqReset);

export default reqResetRoute;
