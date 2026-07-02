import express from "express";

import { 
    deliverBatch, 
    getCurrentBatch, 
    getDeliveryHistory, 
    pickUpBatch 
} from "../controllers/agentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { getCurrentAccount } from "../controllers/authController.js";

const router = express.Router();
router.use(protect);

router.get("/me", getCurrentAccount);

router.get("/delivery-history", getDeliveryHistory);

router.get("/current-batch", getCurrentBatch);

router.patch("/batches/:id/pick-up", pickUpBatch);

router.patch("/batches/:id/deliver", deliverBatch);

export default router

