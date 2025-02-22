import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { totp } from "otplib";
import { validatePassword } from "../validations/user.validation.js"

dotenv.config();
const OTPSECRET = process.env.OTPSECRET;
const PASSWORD = process.env.PASSWORD;

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sidiqjonyusufjanov7@gmail.com",
        pass: PASSWORD,
    },
});

async function reqReset(req, res) {
    try {
        let { email } = req.body;

        let existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            return res.status(404).json({ message: "No account found with the Email address you provided!" });
        }

        let { firstName } = existingUser;

        let otp = totp.generate(`${OTPSECRET}${email}`);

        await transporter.sendMail({
            to: email,
            subject: "Password Reset OTP",
            text: `Use the following OTP to reset your password: ${otp}`,
            html: `<p>Dear <strong>${firstName}</strong>,</p>
                   <p>Use the following OTP to reset your password: <strong>${otp}</strong></p>
                   <p>If you did not request this, please ignore this email.</p>`,
        });

        res.status(200).json({
            message: `${firstName}, an OTP has been sent to your email. Please check and confirm it!`,otp,});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function resPassword(req, res) {
    try {
        let { email, newPassword } = req.body;

        let existingUser = await User.findOne({ where: { email } });
        
        if (!existingUser) {
            return res.status(404).json({ message: "No account found with the Email address you provided!" });
        }
        
        let checkPwd = validatePassword(newPassword);
        if (!checkPwd) {
          return res.status(400).json({ message: "Please, USE stronger password for your safety!For Example: #Abcd123$" });
        }

        let newHashedPwd = bcrypt.hashSync(newPassword, 7);

        let [updated] = await User.update({ password: newHashedPwd },{ where: { email } });

        if (updated) {
            return res.status(200).json({ message: "Your password has been updated successfully!" });
        } else {
            return res.status(400).json({ message: "Error while resetting password. Please try again." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { reqReset, resPassword };

