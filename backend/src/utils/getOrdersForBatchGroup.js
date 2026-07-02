import Order from "../models/Order.js";

export const getOrdersForBatchGroup = async (slotId, batchGroup) => {

    try {

        // find orders belonging to this group
        const orders = await Order.find({
            slot: slotId,
            batchStatus: { $in: ["pending", "shifted"] },
            restaurantZone: batchGroup.restaurantZone._id,
            deliveryZone: batchGroup.deliveryZone._id,
        })
        
        return orders;

    } catch (error) {
        console.log(error)
    }
}