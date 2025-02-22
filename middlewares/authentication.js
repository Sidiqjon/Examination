import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
let JWTSECRET = process.env.JWTSECRET

const authentication = (req, res, next) => {
    let token = req.header("Authorization")
    
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not Authorized!" })
    }
    
    token = token.split(" ")[1]
    
    try {
        const data = jwt.verify(token, JWTSECRET)
        
        if (data.status == "ACTIVE") {
            req.user = data
            next()
        } else {
            return res.status(400).json({ message: "Your Account is not activated. Please verify your email." })
        }
    } catch (error) {
        res.status(401).json({ message: "Something is WRONG with your TOKEN!", data: error.message })
    }
}

export default authentication
