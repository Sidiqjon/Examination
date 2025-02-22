import { Router } from "express";
import { create, findAll, findOne, remove, Search, update } from "../controllers/resources.controller.js";
import authentication from "../middlewares/authentication.js"

let route = Router()

route.get("/search", Search)
route.get("/", findAll)
route.get("/:id", findOne)
route.post("/", authentication, create)
route.patch("/:id", authentication, update)
route.delete("/:id", authentication, remove)

export default route
