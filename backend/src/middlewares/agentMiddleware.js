import jwt from "jsonwebtoken";

import Agent from "../models/Agent.js";

// Check if agent is logged in
export const protectAgent = async (req, res, next) => {

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

        const agent = await Agent.findById(decoded.userId);

        if (!agent) {
            return res.status(401).json({
                message: "Agent not found"
            });
        }

        // Make agent available to controllers
        req.agent = agent;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Not authorized, invalid token"
        });

    }

};