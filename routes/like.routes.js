import { Router } from "express";
import { create, remove } from "../controllers/likes.controller.js";
import authentication from "../middlewares/authentication.js"

let route = Router()

route.post("/", authentication, create)
route.delete("/:id", authentication, remove)

export default route
