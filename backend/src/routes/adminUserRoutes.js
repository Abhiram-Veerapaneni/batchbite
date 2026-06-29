import express from "express";
import { getAllUsers } from "../controllers/adminUserController.js";
import {protect} from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get(
    "/",
    protect,
    adminMiddleware,
    getAllUsers
);

export default router;