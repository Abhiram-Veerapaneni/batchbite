import express from "express";
import { createOrderHandler, modifySlot, cancelOrder, getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrderHandler);
router.get("/my-orders", protect, getMyOrders);

router.patch("/modify/:id", protect, modifySlot);
router.patch("/cancel/:id", protect, cancelOrder);

export default router;
