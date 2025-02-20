import { Router } from "express";
import {create, remove } from "../controllers/userenrolment.controller.js";

const router = Router();

router.post("/", create);  
router.delete("/:id", remove);  

export default router;
