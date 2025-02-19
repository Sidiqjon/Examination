import { Router } from "express";
import commentRoutes from "./comment.routes.js";  
import regionRoutes from "./region.routes.js";  
import userEnrolmentRoutes from "./userenrolment.routes.js";  

const router = Router();

router.use("/comments", commentRoutes);
router.use("/regions", regionRoutes);
router.use("/userenrolments", userEnrolmentRoutes)

export default router;
