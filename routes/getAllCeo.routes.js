import { Router } from "express";
import { getAllCeo } from "../controllers/user.controller.js";

let getAllCeoRoute = Router();

getAllCeoRoute.get("/", getAllCeo);

export default getAllCeoRoute;
