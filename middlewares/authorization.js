import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
let JWTSECRET = process.env.JWTSECRET || "enigma"

const authorization = (roles) => (req, res, next) => {
    let token = req.header("Authorization")
    
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not Authorized!" })
    }
    
    token = token.split(" ")[1]
    
    try {
        const data = jwt.verify(token, JWTSECRET)
        req.user = data
        
        if (roles.includes(data.role)) {
            next()
        } else {
            res.status(401).json({ message: "You Do Not have permission!" })
        }
    } catch (error) {
        res.status(401).json({ message: "Something is WRONG with your TOKEN!", data: error.message })
    }
}

export default authorization
