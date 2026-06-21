import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { getCurrentBatchGroups, getLiveBatchGroups, getTotalOrdersInCurrentBatchGroup } from "../controllers/batchGroupController.js";

const router = express.Router();

router.get("/current", protect, getCurrentBatchGroups)

router.get("/current/:slotId/:deliveryZoneId/:restaurantZoneId", getTotalOrdersInCurrentBatchGroup)

router.get("/live", protect, getLiveBatchGroups);

export default router;
