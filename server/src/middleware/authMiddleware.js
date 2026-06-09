import jwt from "jsonwebtoken";

import User from "../models/User.js";

// check if user is logged in 

export const protect = async (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Prevent disabled accounts
        if (!user.isActive) {
            return res.status(403).json({
                message: "Account has been disabled"
            });
        }

        // making user available to middleware/controllers
        req.user = user;
        
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token"
        });

    }
}

// Restrict route access to specific roles
// returns a middleware function that Express can use
export const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        if(!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();

    };
}