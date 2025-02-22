import { Router } from "express";
import { create, findAll, findOne, remove, Search, update } from "../controllers/learningcenter.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let route = Router()

route.get("/search", Search)
route.get("/", findAll)
route.get("/:id", findOne)
route.post("/", authentication, authorization(["ADMIN", "CEO"]), create)
route.patch("/:id", authentication, authorization(["ADMIN", "CEO"]), update)
route.delete("/:id", authentication, authorization(["ADMIN", "CEO"]), remove)

export default route
