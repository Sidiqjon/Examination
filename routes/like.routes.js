import { Router } from "express";
import { create, findAll, findOne, remove, Search } from "../controllers/likes.controller.js";
import authentication from "../middlewares/authentication.js"

let route = Router()
route.get("/", findAll)
route.get("/search", Search)
route.get("/:id", findOne)
route.post("/", authentication, create)
route.delete("/:id", authentication, remove)

export default route
