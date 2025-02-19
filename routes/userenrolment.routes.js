import { Router } from "express";
import { findAll, findOne, create, update, remove, Search } from "../controllers/userenrolment.controller.js";

const router = Router();

router.get("/", findAll);  
router.get("/search", Search);
router.get("/:id", findOne);  
router.post("/", create);  
router.put("/:id", update);  
router.delete("/:id", remove);  

export default router;
