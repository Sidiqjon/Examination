import { Router } from "express";
import { getAll, getOne, update, remove } from "../controllers/user.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let userRoute = Router();

userRoute.get("/", authentication, authorization(["ADMIN", "CEO", "USER"]), getAll);
userRoute.get("/:id",authentication, authorization(["ADMIN"]), getOne);
userRoute.patch("/:id", authentication, authorization(["ADMIN", "CEO", "USER"]), update);
userRoute.delete("/:id", authentication, authorization(["ADMIN", "CEO", "USER"]), remove);

export default userRoute;
