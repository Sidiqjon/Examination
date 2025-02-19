import { Router } from "express";
import { getAll, getOne, update, remove } from "../controllers/user.controller.js";
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

let userRoute = Router();

userRoute.get("/", authentication, authorization(["admin", "ceo", "user"]), getAll);
userRoute.get("/:id", getOne);
userRoute.patch("/:id", authentication, authorization(["admin", "ceo", "user"]), update);
userRoute.delete("/:id", authentication, authorization(["admin", "ceo", "user"]), remove);

export default userRoute;
