import cron from "node-cron";

import Slot from "../src/models/Slot.js";
import Order from "../src/models/Order.js";
import Batch from "../src/models/Batch.js";
import BatchGroup from "../src/models/BatchGroup.js";
import { getOrdersForBatchGroup } from "../src/utils/getOrdersForBatchGroup.js";

cron.schedule("* * * * *", async() => {

    try {
        
        console.log("Running Slot processor ----");

        // 1. close expired slots
        await Slot.updateMany(
            {
                status: "open",
                endTime: { $lt : new Date() }
            },
            {
                $set: { status : "closed" }
            }
        )

        // 2. Process closed slots
        const closedSlots = await Slot.find({
            status: "closed"
        }).sort({
            startTime: 1
        })

        for( const slot of closedSlots) {

            console.log(`Processing slot ${slot.startTime.getTime()} - ${slot.endTime.getTime()}`);

            // 3. get batchgroups in this slot
            const batchgroups = await BatchGroup.find({
                slot : slot._id,
                status: "collecting"
            })
                .populate("restaurantZone")
                .populate("deliveryZone")

            // 4. Process each batchGroup
            for (const batchGroup of batchgroups) {

                console.log(`   Processing batchGroup ${batchGroup.restaurantZone.name} -> ${batchGroup.deliveryZone.name}`)

                // enough orders ?
                if (batchGroup.totalOrders >= batchGroup.threshold) {

                    const orders = await getOrdersForBatchGroup(slot._id, batchGroup);

                    // create a batch
                    const batch = await Batch.create({
                        slot: slot._id,
                        restaurantZone: batchGroup.restaurantZone,
                        deliveryZone: batchGroup.deliveryZone,
                        orders: 
                            orders.map( order => order._id),
                        orderCount: batchGroup.totalOrders,
                        threshold: batchGroup.threshold
                    })

                    // update status and batch for orders
                    await Order.updateMany(
                        {
                            _id: {
                                $in : orders.map(order => order._id)
                            }
                        },
                        {
                            $set: {
                                status: "out_for_delivery",
                                batch: batch._id
                            }
                        }
                    )

                    // updated batchGroup
                    batchGroup.status = "batched";
                    batchGroup.batch = batch._id;
                    await batchGroup.save();
                }
                // not enough orders
                else {

                    // find next slot
                    const nextSlot = await Slot.findOne({
                        startTime : { $gt : slot.startTime}
                    }).sort({ startTime : 1})

                    // no next slot -> cancel all orders
                    if (!nextSlot) {

                        console.log("Next slot not found, cancelling all the orders")

                        const orders = await getOrdersForBatchGroup(slot._id, batchGroup);

                        // change status to cancel
                        await Order.updateMany(
                            {
                                _id: {
                                    $in : orders.map( order => order._id )
                                }
                            },
                            {
                                $set: { status : "cancelled"}
                            }
                        )
                        // delete batchGroup
                        await BatchGroup.findByIdAndDelete(batchGroup);
                        continue;
                    }

                    // else move orders
                    const orders = await getOrdersForBatchGroup(slot._id, batchGroup);

                    await Order.updateMany(
                        {
                            _id: { $in : orders.map( order => order._id ) }
                        },
                        {
                            $set: {
                                slot: nextSlot._id,
                                status: "shifted",
                                canModifyUntil: new Date(nextSlot.startTime.getTime() + 5 * 60 * 1000)
                            },
                            $inc: { shiftCount: 1 }
                        }
                    )

                    // move batchGroup to next slot
                    // find if existingBatchGroup with same slot and zones exit
                    const existingBatchGroup = await BatchGroup.findOne({
                        slot : nextSlot._id,
                        restaurantZone: batchGroup.restaurantZone,
                        deliveryZone: batchGroup.deliveryZone
                    })

                    // if no -> then change the slotid
                    if (!existingBatchGroup) {
                        batchGroup.slot = nextSlot._id
                        await batchGroup.save()
                    }
                    // merge into existing batchGroup i.e totalOrders
                    else {

                        await BatchGroup.findByIdAndUpdate(
                            existingBatchGroup._id,
                            {
                                $inc : { totalOrders : batchGroup.totalOrders}
                            }
                        )

                        await BatchGroup.findByIdAndDelete(batchGroup._id)
                    }
                    
                }
            }

            // 5. mark slot as processed
            slot.status = "processed";
            await slot.save();
        }

    } catch (error) {
        console.error(
            "Error processing slots:",
            error
        );
    }
})