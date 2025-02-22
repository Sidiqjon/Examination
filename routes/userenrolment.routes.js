import { Router } from "express";
import {create, remove } from "../controllers/userenrolment.controller.js";
import authentication from "../middlewares/authentication.js"

const router = Router();

router.post("/",authentication, create);  
router.delete("/:id",authentication, remove);  

export default router;
