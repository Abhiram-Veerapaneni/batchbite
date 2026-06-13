import express from "express";

import { getMenuItemById } from "../controllers/menuItemController.js";

const router = express.Router();

// Get a single food item
router.get("/:id", getMenuItemById);

export default router;