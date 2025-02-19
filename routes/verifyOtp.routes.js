import { Router } from "express";
import verifyOtp from "../controllers/verifyotp.controller.js";

let verifyOtpRoute = Router();

verifyOtpRoute.post("/", verifyOtp);

export default verifyOtpRoute;
