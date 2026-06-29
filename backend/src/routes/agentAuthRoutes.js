import express from "express";
import { protectAgent } from "../middlewares/agentMiddleware.js";
import { getCurrentAgent, loginAgent, logoutAgent, registerAgent } from "../controllers/agentAuthController.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(protectAgent);

router.post("/login", loginAgent);

router.post("/logout", logoutAgent);

router.get("/me", getCurrentAgent);

export default router

