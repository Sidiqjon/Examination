import User from "../models/user.model.js";
import dotenv from "dotenv";
import { totp } from "otplib";

dotenv.config();
const OTPSECRET = process.env.OTPSECRET || "lantern";

async function verifyOtp(req, res) {
    try {
        let { email, otp } = req.body;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "No account found with the Email address you provided!" });
        }

        let isValidOTP = totp.verify({ token: otp, secret: `${OTPSECRET}${email}` });
        
        if (!isValidOTP) {
            return res.status(400).json({ message: "Invalid OTP!" });
        }

        // if (user.status === "active") {
        //     return res.status(400).json({ message: "Account is already activated!" });
        // }

        await User.update({ status: "ACTIVE" }, { where: { email } });

        res.status(200).json({ message: "OTP verified successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default verifyOtp;

