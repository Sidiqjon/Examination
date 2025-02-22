import { Router } from "express";
import { create, remove } from "../controllers/lcfield.controller.js"
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let route = Router()

route.post("/", authentication, authorization(["ADMIN", "CEO"]), create)
route.delete("/", authentication, authorization(["ADMIN", "CEO"]), remove)

export default route
