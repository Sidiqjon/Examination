import { Router } from "express";
import { create, remove } from "../controllers/lcfield.controller.js"

let route = Router()

route.post("/", create)
route.delete("/", remove)

export default route