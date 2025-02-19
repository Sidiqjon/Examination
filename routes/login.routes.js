import { Router } from "express";
import Login from "../controllers/login.controller.js";

let loginRoute = Router();

loginRoute.post("/", Login);

export default loginRoute;
