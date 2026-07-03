import express from "express";

import {
    changeUserPassword,
    getUserProfile,
    updateUserProfile
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getUserProfile);
router.patch("/profile", upload.single('image'), updateUserProfile);
router.patch("/change-password", changeUserPassword);

export default router;