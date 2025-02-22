import { Router } from "express";
import sendOtp from "../controllers/sendOTP.controller.js";

let sendOtpRoute = Router();

sendOtpRoute.post("/", sendOtp);

export default sendOtpRoute;

