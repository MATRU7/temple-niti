import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function authMiddleware(req, res, next) {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.status(401).send({ message: "No token provided, authorization denied." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        
        if (!req.user) {
            return res.status(401).send({ message: "Invalid token, user not found." });
        }
        
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send({ message: "Token verification failed.", error: error.message });
    }
}

export default authMiddleware;
