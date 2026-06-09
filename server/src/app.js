import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";

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

export default app;