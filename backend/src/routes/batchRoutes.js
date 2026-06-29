import express from "express"
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

import { assignBatch, getAllBatches, getBatchById } from "../controllers/batchController.js";


const router = express.Router();

router.use(
    protect,
    adminMiddleware
)

router.get("/", getAllBatches);
router.get("/:id", getBatchById);
router.patch("/:id/assign", assignBatch)

export default router