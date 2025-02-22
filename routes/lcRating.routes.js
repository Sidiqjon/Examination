import { Router } from "express";
import { getLCsByStars, getLCsByComments, getLCsByLikes } from "../controllers/lcRating.controller.js";

const route = Router();

route.get("/stars", getLCsByStars);
route.get("/comments", getLCsByComments);
route.get("/likes", getLCsByLikes);

export default route

