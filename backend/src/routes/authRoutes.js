import express from "express";

import {
    registerUser,
    registerRestaurant,
    loginAccount,
    logoutAccount,
    getCurrentAccount,
    registerAgent
} from "../controllers/authController.js";

import { protect} from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public routes

router.post("/student/register", registerUser);

router.post("/restaurant/register", registerRestaurant);

router.post("/login", loginAccount);

// Protected routes

router.post("/agent/register", protect, adminMiddleware, registerAgent);

router.post("/logout", protect, logoutAccount);
router.get("/me", protect, getCurrentAccount);

export default router;