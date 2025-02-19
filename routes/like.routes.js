import { Router } from "express";
import { create, findAll, findOne, remove, Search } from "../controllers/likes.controller.js";

let route = Router()
route.get("/", findAll)
route.get("/search", Search)
route.get("/:id", findOne)
route.post("/", create)
route.delete("/:id", remove)

export default route