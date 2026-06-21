import express from "express";
import Slot from "../models/Slot.js";
import { getSlotDashBoard } from "../controllers/slotController.js";
import { protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

// get all active slots
router.get("/", async (req, res) => {

    const slots = await Slot.find({status: "open"}).sort({ startTime: 1 });
    
    res.json(slots)
});

router.get("/dashboard", protect, getSlotDashBoard);

export default router;