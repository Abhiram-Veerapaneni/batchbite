import mongoose from "mongoose";
import dotenv from "dotenv";
import Slot from "../src/models/Slot.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, { dbName: "batchbiteDB" });

const generateSlots = async () => {

    const slots = [];

    // today
    let current = new Date();

    current.setHours(19, 0, 0, 0);

    const closingTime = new Date();

    closingTime.setHours(20, 0, 0, 0);

    while (current < closingTime) {

        const startTime = new Date(current);

        current.setMinutes(
            current.getMinutes() + 15
        );

        const endTime = new Date(current);

        slots.push({

            startTime,

            endTime,

            totalOrders: 0,

            threshold: 5,

            status: "open"

        });

    }

    await Slot.insertMany(slots);

    console.log("Slots generated");

    process.exit();

};

generateSlots();