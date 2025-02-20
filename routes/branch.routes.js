import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/branch.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let route = Router();

route.get("/", findAll);
route.get("/:id", findOne);
route.post("/", authentication, authorization(["admin", "ceo"]), create);
route.patch("/:id", authentication, authorization(["admin", "ceo"]), update);
route.delete("/:id", authentication, authorization(["admin", "ceo"]), remove);

export default route;
