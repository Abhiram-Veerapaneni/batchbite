import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Agent from "../models/Agent.js";
import Restaurant from "../models/Restaurant.js";

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

        const accountType = decoded.accountType;

        let account = null;

        if (accountType === "student" || accountType === "admin")
            account = await User.findById(decoded.accountId);

        if (accountType === "agent")
            account = await Agent.findById(decoded.accountId);

        if (accountType === "restaurant")
            account = await Restaurant.findById(decoded.accountId);
    
        if (!account) {
                return res.status(401).json({
                    message: "Account not found"
                });
            }

        // Prevent disabled accounts
        if (accountType === "student" && !account.isActive) {
            return res.status(403).json({
                message: "Account has been disabled"
            });
        }

        // making user available to middleware/controllers
        req.account = account;
        req.accountType = accountType;

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

        if (!roles.includes(req.account.role)) {

            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();

    };
}