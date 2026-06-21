import mongoose from "mongoose";
import dotenv from "dotenv";
import Slot from "../src/models/Slot.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, { dbName: "batchbiteDB" });

const generateSlots = async () => {

    const slots = [];

    // today
    let current = new Date();

    current.setHours(12, 15, 0, 0);

    const closingTime = new Date();

    closingTime.setHours(13, 0, 0, 0);

    while (current < closingTime) {

        const startTime = new Date(current);

        current.setMinutes(
            current.getMinutes() + 8
        );

        const endTime = new Date(current);

        slots.push({

            startTime,

            endTime,

            threshold: 5,

            status: "open"

        });

    }

    await Slot.insertMany(slots);

    console.log("Slots generated");

    process.exit();

};

generateSlots();