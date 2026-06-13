import express from "express"

import {
    getCart, 
    addToCart, 
    increaseQuantity,
    decreaseQuantity,
    clearCart
} from "../controllers/cartController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.patch("/increase/:itemId", protect, increaseQuantity);
router.patch("/decrease/:itemId", protect, decreaseQuantity);

router.delete("/", protect, clearCart);

export default router;