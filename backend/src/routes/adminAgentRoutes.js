import express from "express"
import { deleteAgent, deliverBatch, getAgentByID, getAllAgents, getCurrentBatch, pickUpBatch, updateAgent } from "../controllers/agentController.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { registerAgent } from "../controllers/agentAuthController.js";

const router = express.Router();

router.use(protect ,adminMiddleware);

router.get("/", getAllAgents);

router.get("/:id", getAgentByID);

router.patch("/:id", updateAgent);

router.delete("/:id", deleteAgent);

export default router;