import express from "express";
import Zone from "../models/Zone.js";

// import { protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", async(req, res) => {
    const zones = await Zone.find();
    res.json(zones);
})

export default router;