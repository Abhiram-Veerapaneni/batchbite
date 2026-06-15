import cron from "node-cron";

import Slot from "../src/models/Slot.js"
import Order from "../src/models/Order.js";


cron.schedule("* * * * *", async () => {

    console.log("Running slot processor ------------------------");

    const expiredSlots = await Slot.find({
        status: "open",
        endTime: {
            $lt: new Date()
        }
    })

    // mark as closed
    for (const slot of expiredSlots) {

        slot.status = "closed";
        await slot.save();
    }

    // process closed slots
    const closedSlots = await Slot.find({
        status: "closed"
    })

    for (const slot of closedSlots) {

        // enough orders ?
        if (slot.totalOrders >= slot.threshold) {

            slot.status = "out_for_delivery";
            await slot.save();

            await Order.updateMany(
                { slot: slot._id },
                {
                    status: "out_for_delivery"
                }
            )
        }
        else {

            //find next slot
            const nextSlot = await Slot.findOne({
                startTime: {
                    $gte: slot.endTime
                }
            }).sort({ startTime: 1 })

            if (!nextSlot) {
                console.log(`No next slot found for slot ${slot._id}`);

                slot.status = "processed";
                await slot.save();

                continue;
            }

            // move orders
            await Order.updateMany(
                {
                    slot: slot._id,
                    status: { $in: ["pending", "shifted"] }
                },
                {
                    $set: {
                        slot: nextSlot._id,
                        status: "shifted",
                        canModifyUntil: new Date(
                            nextSlot.startTime.getTime() + 5 * 60 * 1000
                        )
                    },
                    $inc: {
                        shiftCount: 1
                    }
                }
            );

            // update totalorders
            nextSlot.totalOrders += slot.totalOrders;
            slot.totalOrders = 0;

            slot.status = "processed";

            await slot.save();
            await nextSlot.save();
        }
    }
})


// * * * * * *
// │ │ │ │ │ └─ Day of week
// │ │ │ │ └── Month
// │ │ │ └──── Day of month
// │ │ └────── Hour
// │ └──────── Minute
// └────────── Second