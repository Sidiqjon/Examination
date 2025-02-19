import { Router } from "express";
import Register from "../controllers/register.controller.js";

let registerRoute = Router();

registerRoute.post("/", Register);

export default registerRoute;
