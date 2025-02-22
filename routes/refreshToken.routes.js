import { Router } from "express";
import refreshToken from "../controllers/refreshToken.controller.js";

let refreshTokenRoute = Router();

refreshTokenRoute.post("/", refreshToken);

export default refreshTokenRoute;

