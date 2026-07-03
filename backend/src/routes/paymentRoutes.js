import express from "express";
import {
    createPaymentOrder,
    refundPayment,
    settleLedger,
    verifyPayment
} from "../controllers/paymentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { getRestaurantLegers } from "../controllers/restaurantLedgerController.js";

const router = express.Router();

router.post("/create-order", protect, createPaymentOrder);

router.post("/verify", protect, verifyPayment);

router.post("/refund", protect, refundPayment);

router.get("/ledgers", protect, getRestaurantLegers)

router.patch("/settle/:ledgerId", protect, adminMiddleware, settleLedger);

export default router;