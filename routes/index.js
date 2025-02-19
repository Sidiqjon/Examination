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

let mainRoute = Router()

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

export default mainRoute
