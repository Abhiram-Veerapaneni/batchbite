import express from "express";
import { 
    getRestaurants, 
    getRestaurantById, 
    getMenu, 
    updateMenu,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getOrderDetails,
    getTodaysOrders,
    getRestaurantOrderHistory,
    getRestaurantProfile,
    updateRestaurantProfile,
    changeRestaurantPassword
} from "../controllers/restaurantController.js";

import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Get all 
router.get("/", getRestaurants);

// APIs for Restaurant role

router.get("/menu", protect, getMenu); 

router.post("/menu", protect, upload.single("image"), updateMenu);

router.patch("/menu/:itemId", protect, upload.single("image"), updateMenuItem);

router.delete("/menu/:itemId", protect, deleteMenuItem);

router.patch("/menu/:itemId/toggle", protect, toggleAvailability);

router.get("/orders/today", protect, getTodaysOrders);

router.get("/order-history", protect, getRestaurantOrderHistory);

router.get("/orders/:orderId", protect, getOrderDetails);

router.get("/profile" , protect, getRestaurantProfile);

router.patch("/profile", protect, upload.single("image"), updateRestaurantProfile);

router.patch("/change-password", protect, changeRestaurantPassword);

// Get restaurant + menu
router.get("/:id", getRestaurantById);

export default router;