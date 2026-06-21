import BatchGroup from "../models/BatchGroup.js";
import Slot from "../models/Slot.js";

// GET /api/batch-groups/current
export const getCurrentBatchGroups = async (req, res) => {

    try {

        const userDeliveryZone = req.user.address.zone

        const batchGroups = await BatchGroup
            .find({
                deliveryZone: userDeliveryZone,
                status: "collecting"
            })
            .populate("slot")
            .populate("restaurantZone", "name")
            .populate("deliveryZone", "name")
            .sort({ "slot.startTime": 1 })

        res.status(200).json(batchGroups);
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch batch groups"
        });
    }
}

// GET /api/batch-groups/current/:slotId/:deliveryZoneId/:restaurantId/
export const getTotalOrdersInCurrentBatchGroup = async (req, res) => {
    try {
        const { slotId, deliveryZoneId, restaurantZoneId } = req.params;

        const batchGroup = await BatchGroup.findOne({
            slot: slotId,
            restaurantZone: restaurantZoneId,
            deliveryZone: deliveryZoneId,
            status: "collecting"
        });

        res.status(200).json({
            totalOrders: batchGroup?.totalOrders || 0,
            threshold: batchGroup?.threshold || 0
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch batch group"
        });
    }
};

// GET /api/batch-groups/live
export const getLiveBatchGroups = async (req, res) => {
    try {

        const userZone = req.user.address.zone;

        const now = new Date();

        let slot = await Slot.findOne({
            startTime: { $lte: now },
            endTime: { $gt: now }
        }).sort({ startTime: 1 });

        let isCurrent = true;

        if (!slot) {
            slot = await Slot.findOne({
                startTime: { $gt: now }
            }).sort({ startTime: 1 });

            isCurrent = false;
        }

        if (!slot) {
            return res.json({
                slot: null,
                isCurrent: false,
                batchGroups: []
            });
        }

        const batchGroups = await BatchGroup.find({
            slot: slot._id,
            deliveryZone: userZone,
            status: "collecting"
        })
            .populate("restaurantZone", "name")
            .populate("deliveryZone", "name");

        res.json({
            slot,
            isCurrent,
            batchGroups
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }
};