import Slot from "../models/Slot.js";
import Order from "../models/Order.js";

// GET /slots/dashboard
export const getSlotDashBoard = async (req, res) => {

    try {

        const userPincode = req.user.address.pincode;

        const now = new Date();

        /*
         * Fetch:
         * 1. Current open slot
         * 2. Next open slot
         */
        const slots = await Slot.find({
            status: "open",
            endTime: { $gte: now }
        })
        .sort({ startTime: 1 })
        .limit(6);

        // No upcoming slots
        if (slots.length === 0) {
            return res.status(200).json([]);
        }

        const slotIds = slots.map(slot => slot._id);

        /*
         * Count pending/shifted orders
         * for this user's destination pincode
         * grouped by slot and restaurant pincode
         */
        const groupedOrders = await Order.aggregate([
            {
                $match: {
                    "deliveryAddress.pincode": userPincode,
                    status: {
                        $in: ["pending", "shifted"]
                    },
                    slot: {
                        $in: slotIds
                    }
                }
            },
            {
                $group: {
                    _id: {
                        slot: "$slot",
                        restaurantPincode: "$restaurantPincode"
                    },
                    totalOrders: {
                        $sum: 1
                    }
                }
            }
        ]);

        const slotMap = new Map();
        const thresholdMap = new Map();

        // initialize slots
        for (const slot of slots) {

            const slotId = slot._id.toString();

            slotMap.set(
                slotId,
                {
                    slotId: slot._id,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    status: slot.status,

                    // frontend can highlight this
                    isCurrent:
                        slot.startTime <= now &&
                        now < slot.endTime,

                    zones: []
                }
            );

            thresholdMap.set(
                slotId,
                slot.threshold
            );
        }

        /*
         * Populate zones
         */
        for (const group of groupedOrders) {

            const slotId = group._id.slot.toString();

            const slotData = slotMap.get(slotId);

            if (!slotData) continue;

            slotData.zones.push({
                restaurantPincode:
                    group._id.restaurantPincode,

                totalOrders:
                    group.totalOrders,

                threshold:
                    thresholdMap.get(slotId)
            });
        }

        res.status(200).json(
            Array.from(slotMap.values())
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};
