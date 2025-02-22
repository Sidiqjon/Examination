import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { totp } from "otplib";
import { 
  userValidationAdmin, 
  validateEmail, 
  validatePhoneNumber, 
  validatePassword, 
  validateName } from "../validations/user.validation.js";

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

totp.options = { step: 1800, digits: 6 };

async function createAdmin(req, res) {
  try {
    let { firstName, lastName, password, email, phoneNumber, role } = req.body;

    let checkfName = validateName(firstName)
    if (!checkfName) {
      return res.status(400).json({ message: "Name format is incorrect!Name must be at least 2 characters and contains only letters!" });
    }

    let checklName = validateName(lastName)
    if (!checklName) {
      return res.status(400).json({ message: "Surname format is incorrect!Surname must be at least 2 characters and contains only letters!" });
    }

    let checkEmail = validateEmail(email);
    if (!checkEmail) {
      return res.status(400).json({ message: "Email format is incorrect!Format: 'example@example.com'" });
    }

    let checkPN = validatePhoneNumber(phoneNumber);
    if (!checkPN) {
      return res.status(400).json({ message: "Phone Number format is incorrect!Format: +998900000000" });
    }

    let checkPwd = validatePassword(password);
    if (!checkPwd) {
      return res.status(400).json({ message: "Please, USE stronger password for your safety!For Example: #Abcd123$" });
    }

    if (role && role !== "ADMIN") {
      return res.status(400).json({ message: `ROLE must be 'ADMIN'!` });  
    }

    if (!role) {
      role = "ADMIN";
    }

    req.body.role = role;

    let { error, value } = userValidationAdmin.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "This email has already been taken!" });
    }

    let hashedPassword = bcrypt.hashSync(password, 7);

    value.password = hashedPassword;

    const result = await User.create(value);
    
    if (result) {
      try {
        let { firstName, email } = result;

        let otp = totp.generate(`${OTPSECRET}${email}`);

        await transporter.sendMail({
          to: email,
          subject: "Activate your account",
          text: `Please use the following OTP to confirm your email account: ${otp}`,
          html: `<p>Please use the following OTP to confirm your email account: ${otp}</p>`,
        });

        res.status(201).json({
          message: `${firstName}, You registered successfully as an Admin! An OTP has been sent to your Email!`,
          otp,data: result
        });
      } catch (error) {
        res.status(503).json({ message: "Email service is unavailable, please try again later.", error: error.message });
      }
    } else {
      return res.status(400).json({ message: "Error While Registration." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default createAdmin;
