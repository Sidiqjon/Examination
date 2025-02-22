import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWTSECRET = process.env.JWTSECRET || "enigma";            
const REFRESHJWT = process.env.REFRESHJWT || "february";

function genAccessToken(user) {
    return jwt.sign({ id: user.id, role: user.role, status: user.status }, JWTSECRET, { expiresIn: "1d" });
}

function genRefreshToken(user) {
    return jwt.sign({ id: user.id, role: user.role, status: user.status }, REFRESHJWT, { expiresIn: "7d" });
}

async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, REFRESHJWT);

        const user = await User.findOne({ where: { id: decoded.id } });
        
        if (!user) {
            return res.status(404).json({ message: "User not found with the refresh token you provided!" });
        }

        if (user.status !== "active") {
            return res.status(400).json({ message: "Your Account is not active. Please verify your email first!" });
        }

        const accessToken = genAccessToken(user)

        res.status(200).json({ message: "Your access token has been refreshed!", accessToken });
    } catch (error) {
        res.status(400).json({ message: "Something is WRONG with your REFRESH TOKEN!", error: error.message });
    }
}

export default refreshToken;

