import { Router } from "express";
import { findAll, Search, findOne, create, update, remove } from "../controllers/comment.controller.js";
import authentication from "../middlewares/authentication.js"

const router = Router();

router.get("/search", Search);  
router.get("/", findAll);  
router.get("/:id", findOne);  
router.post("/",authentication, create);  
router.patch("/:id",authentication, update);  
router.delete("/:id",authentication, remove);  

export default router;

