import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";

import menuItemRoutes from "./routes/menuItemRoutes.js";

import orderRoutes from "./routes/orderRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

app.use(

    cors({

        origin: "http://localhost:5173",
        credentials: true // allow cookies
    })
);

app.use(express.json()); // parse incoming json data

app.use(cookieParser());


// Routes 
app.use("/api/auth", authRoutes);

app.use("/api/restaurants", restaurantRoutes);

app.use("/api/menu-items", menuItemRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/slots", slotRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/cart", cartRoutes);
export default app;