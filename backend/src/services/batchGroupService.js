import BatchGroup from "../models/BatchGroup.js";

export const incrementBatchGroup = async (order, slotDoc) => {

    // find batchGroup and increase total orders 
    // or create if didn't exist
    const batchGroup = await BatchGroup.findOneAndUpdate(
        {
            slot: order.slot,
            restaurantZone: order.restaurantZone,
            deliveryZone: order.deliveryZone
        },
        {
            $inc: { totalOrders: 1 },
            $setOnInsert: {
                threshold: slotDoc.threshold
            }
        },
        {
            upsert: true,
            new: true
        }
    );
}

export const decrementBatchGroup = async (order) => {
    // update totalOrders in old BatchGroup
    const batchGroup = await BatchGroup.findOneAndUpdate(
        {
            slot: order.slot,
            restaurantZone: order.restaurantZone,
            deliveryZone: order.deliveryZone
        },
        {
            $inc: { totalOrders: -1 }
        },
        {
            returnDocument: "after"
        }
    )

    if (batchGroup?.totalOrders === 0) {
        await BatchGroup.findByIdAndDelete(batchGroup._id);
    }
}

export const moveOrderBetweenBatchGroup = async (order, newSlot) => {
    // shift into new BatchGroup
    await BatchGroup.findOneAndUpdate(
        {
            slot: newSlot,
            restaurantZone: order.restaurantZone,
            deliveryZone: order.deliveryZone
        },
        {
            $inc: { totalOrders: 1 },
            $setOnInsert: {
                threshold: newSlot.threshold
            }
        },
        {
            upsert: true
        }
    )
}
