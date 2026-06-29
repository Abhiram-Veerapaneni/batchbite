import Agent from "../models/Agent.js";
import generateToken from "../utils/generateToken.js";

// Register Agent
const registerAgent = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            zones
        } = req.body;

        const existingAgent = await Agent.findOne({ email });

        if (existingAgent) {
            return res.status(400).json({
                message: "Agent already exists"
            });
        }

        const agent = await Agent.create({
            name,
            email,
            password,
            phone,
            zones
        });

        res.status(201).json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            phone: agent.phone,
            zones: agent.zones,
            status: agent.status
        });

    } catch (error) {

        console.error("REGISTER AGENT ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }

};

// Login Agent
const loginAgent = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const agent = await Agent
            .findOne({ email })
            .select("+password");

        if (!agent) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect =
            await agent.matchPassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        generateToken(res, agent._id, "agent");

        res.status(200).json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            phone: agent.phone,
            zones: agent.zones,
            status: agent.status,
            currentBatch: agent.currentBatch
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Logout Agent
const logoutAgent = async (req, res) => {

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        message: "Logged out successfully"
    });

};

// Get Current Logged-in Agent
const getCurrentAgent = async (req, res) => {

    res.status(200).json(req.agent);

};

export {
    registerAgent,
    loginAgent,
    logoutAgent,
    getCurrentAgent
};