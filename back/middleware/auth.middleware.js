import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function authMiddleware(req, res, next) {
    try {
        // Support both cookie and Bearer token (for API clients)
        let token = req.cookies?.token;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decoded.id, isActive: true }).select('-password -refreshToken');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Session invalid. Please log in again."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid authentication token." });
        }
        next(error);
    }
}

// ── Role-based access control helper ─────────────────────────────────────────
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action."
            });
        }
        next();
    };
}

export default authMiddleware;
