import { Router } from "express";

import userRoute from "./user.routes.js";
import registerRoute from "./register.routes.js";
import loginRoute from "./login.routes.js";
import verifyOtpRoute from "./verifyOtp.routes.js";
import reqResetRoute from "./requestReset.routes.js";
import resetPwdRoute from "./resetPwd.routes.js";
import sendOtpRoute from "./sendOTP.routes.js";
import addAdminRoute from "./addAdmin.routes.js"
import uploadIMGRoute from "./uploadIMG.routes.js";
import getAllCeoRoute from "./getAllCeo.routes.js"
import userExcelRoute from "./excelFile.routes.js"
import commentRoutes from "./comment.routes.js";  
import regionRoutes from "./region.routes.js";  
import userEnrolmentRoutes from "./userenrolment.routes.js";  
import routeResources from "./resources.routes.js";
import routeLike from "./like.routes.js";
import routeResourcesCategory from "./resourcesCategory.routes.js";
import routeProfession from "./profession.routes.js";
import routeSubject from "./subject.routes.js";
import routeField from "./field.routes.js";
import routeLearningCenter from "./learningcenter.routes.js";
import routeLcField from "./lcfield.routes.js";
import routeBranch from "./branch.routes.js";
import Upoad from "./upload.routes.js";

let mainRoute = Router()

mainRoute.use("/resources-categ", routeResourcesCategory);
mainRoute.use("/resources", routeResources);
mainRoute.use("/like", routeLike);
mainRoute.use("/profession", routeProfession);
mainRoute.use("/subject", routeSubject);
mainRoute.use("/field", routeField);
mainRoute.use("/learning-center", routeLearningCenter);
mainRoute.use("/lcfield", routeLcField);
mainRoute.use("/branch", routeBranch);
mainRoute.use("/uploadimg", Upoad);
mainRoute.use("/comments", commentRoutes);
mainRoute.use("/regions", regionRoutes);
mainRoute.use("/userenrolments", userEnrolmentRoutes)
mainRoute.use("/register", registerRoute);
mainRoute.use("/login", loginRoute);
mainRoute.use("/verify-otp", verifyOtpRoute);
mainRoute.use("/request-reset", reqResetRoute);
mainRoute.use("/reset-password", resetPwdRoute);
mainRoute.use("/users", userRoute);
mainRoute.use("/send-otp", sendOtpRoute)
mainRoute.use("/add-admin", addAdminRoute)
mainRoute.use("/upload-img", uploadIMGRoute)
mainRoute.use("/all-ceo", getAllCeoRoute)
mainRoute.use("/users-excel", userExcelRoute)

export default mainRoute;
