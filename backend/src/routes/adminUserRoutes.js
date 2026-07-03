import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, adminMiddleware, getAllUsers);

export default router;