import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ── Helper: generate tokens ───────────────────────────────────────────────────
function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

function setCookieToken(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 86400 * 1000 // 1 day
    });
}

// ── Register ──────────────────────────────────────────────────────────────────
async function addUser(req, res, next) {
    try {
        let { name, email, mobile, password } = req.body;
        email = email.trim().toLowerCase();

        // Check for existing email
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: "Email is already registered." });
        }

        // Check for existing mobile
        const existingMobile = await User.findOne({ mobile: String(mobile) });
        if (existingMobile) {
            return res.status(409).json({ success: false, message: "Mobile number is already registered." });
        }

        // Password hashed automatically via pre-save hook in User model
        const newUser = await User.create({ name, email, mobile: String(mobile), password });
        
        // Return user without password (toJSON transform handles this)
        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: newUser
        });
    } catch (error) {
        next(error);
    }
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function loginUser(req, res, next) {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();

        // Select password explicitly (it's select:false in schema)
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: "Account has been deactivated. Contact support." });
        }

        // Secure bcrypt comparison
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const token = generateAccessToken(user);
        setCookieToken(res, token);

        // Return user data (password excluded via toJSON)
        const userData = user.toJSON();
        res.json({ success: true, message: "Logged in successfully.", user: userData });

    } catch (error) {
        next(error);
    }
}

// ── Logout ────────────────────────────────────────────────────────────────────
async function logout(req, res, next) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        });
        res.json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        next(error);
    }
}

// ── Get Current User ──────────────────────────────────────────────────────────
async function getCurrentUser(req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
}

// ── Get All Users (Admin only) ────────────────────────────────────────────────
async function allUsers(req, res, next) {
    try {
        const users = await User.find({ isActive: true }).select('-password -refreshToken');
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        next(error);
    }
}

// ── Get User By ID ────────────────────────────────────────────────────────────
async function getUserById(req, res, next) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
}

// ── Update User ───────────────────────────────────────────────────────────────
async function updateUser(req, res, next) {
    try {
        const { id } = req.params;

        // Prevent role escalation from this endpoint
        delete req.body.role;
        delete req.body.password; // Use a dedicated change-password endpoint

        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        next(error);
    }
}

// ── Delete User (Soft Delete) ─────────────────────────────────────────────────
async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, message: "User deactivated successfully." });
    } catch (error) {
        next(error);
    }
}

export {
    addUser,
    allUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    logout,
    getCurrentUser
};