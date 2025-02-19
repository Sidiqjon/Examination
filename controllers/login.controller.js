import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWTSECRET = process.env.JWTSECRET;

function genAccessToken(user) {
    return jwt.sign({ id: user.id, role: user.role, status: user.status }, JWTSECRET);
}

async function Login(req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "No account found with the Email address you provided!" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        if (user.status != "active") {
            return res.status(400).json({ message: "Your Account is not active. Please verify your email first!" });
        }

        const accessToken = genAccessToken(user)

        res.status(200).json({ message: "Logged in successfully!", token: accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default Login;
