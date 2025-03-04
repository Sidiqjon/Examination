import User from "../models/user.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { totp } from "otplib";
import { validateEmail } from "../validations/user.validation.js";

dotenv.config();
const OTPSECRET = process.env.OTPSECRET || "lantern";
const PASSWORD = process.env.PASSWORD || "dhwj ofzg kswh ybzf" ;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sidiqjonyusufjanov7@gmail.com",
    pass: PASSWORD,
  },
});

totp.options = { step: 1800, digits: 6 };

async function sendOtp(req, res) {
  try {
    let { email } = req.body;

    let checkEmail = validateEmail(email);
    if (!checkEmail) {
      return res.status(400).json({ message: "Email format is incorrect!Format: 'example@example.com'" });
    }

    const existingUser = await User.findOne({ where: { email } });
    
    if (!existingUser) {
      return res.status(404).json({ message: "No account found with the Email address you provided!" });
    }

    let otp = totp.generate(`${OTPSECRET}${email}`);
    await transporter.sendMail({
      to: email,
      subject: "Activate your account",
      text: `Please use the following OTP to confirm your email account: ${otp}`,
      html: `<p>Please use the following OTP to confirm your email account: ${otp}</p>`,
    });
    res.status(200).json({
      message: `${existingUser.firstName}, An OTP has been sent to your Email!`,otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default sendOtp;

