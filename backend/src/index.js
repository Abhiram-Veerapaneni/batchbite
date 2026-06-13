import dotenv from "dotenv";

dotenv.config(); // loads env variables into process.env

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT  = process.env.PORT || 6000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
    
})