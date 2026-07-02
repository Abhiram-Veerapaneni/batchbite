import express from "express";
import { createPaymentOrder, refundPayment, verifyPayment } from "../controllers/paymentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/create-order", createPaymentOrder);

router.post("/verify", verifyPayment);

router.post("/refund", refundPayment);

export default router;