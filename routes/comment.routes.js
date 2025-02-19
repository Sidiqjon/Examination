import { Router } from "express";
import { findAll, Search, findOne, create, update, remove } from "../controllers/comment.controller.js";

const router = Router();

router.get("/", findAll);  
router.get("/search", Search);  
router.get("/:id", findOne);  
router.post("/", create);  
router.patch("/:id", update);  
router.delete("/:id", remove);  

export default router;
