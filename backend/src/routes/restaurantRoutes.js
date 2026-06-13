import express from "express";
import { getRestaurants, getRestaurantById } 
    from "../controllers/restaurantController.js";

const router = express.Router();

// Get all 
router.get("/", getRestaurants);

// Get restaurant + menu
router.get("/:id", getRestaurantById);

export default router;