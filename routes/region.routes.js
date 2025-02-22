import { Router } from "express";
import { findAll, Search, findOne, create, update, remove } from "../controllers/region.controller.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get("/search", Search);
router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", authentication, authorization(["ADMIN"]), create);          
router.patch("/:id", authentication, authorization(["ADMIN"]), update);
router.delete("/:id", authentication, authorization(["ADMIN"]), remove);

export default router;
