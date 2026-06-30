import express from "express";
import { protectAgent } from "../middlewares/agentMiddleware.js";
import { getCurrentAgent, loginAgent, logoutAgent, registerAgent } from "../controllers/agentAuthController.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { deliverBatch, getCurrentBatch, getDeliveryHistory, pickUpBatch } from "../controllers/agentController.js";

const router = express.Router();

router.post("/register" , adminMiddleware, registerAgent);

router.post("/login", loginAgent);

router.post("/logout", protectAgent, logoutAgent);

router.get("/me", protectAgent, getCurrentAgent);

router.get("/delivery-history", protectAgent, getDeliveryHistory);

router.get("/current-batch", protectAgent, getCurrentBatch);

router.patch("/batches/:id/pick-up", protectAgent, pickUpBatch);

router.patch("/batches/:id/deliver", protectAgent, deliverBatch);

export default router

