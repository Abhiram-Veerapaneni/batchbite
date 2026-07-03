// import "dotenv/config"; // loads env variables into process.env

import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

// import "../jobs/processSlots.js";

const PORT = process.env.PORT || 6000;

connectDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Running on port ${PORT}`);
})