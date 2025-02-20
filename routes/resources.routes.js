import { Router } from "express";
import { create, findAll, findOne, remove, Search, update } from "../controllers/resources.controller.js";

let route = Router()

route.get("/search", Search)
route.get("/", findAll)
route.get("/:id", findOne)
route.post("/", create)
route.patch("/:id", update)
route.delete("/:id", remove)

export default route
