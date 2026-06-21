import mongoose from "mongoose";

/**
 slot
 restaurantZone
 deliveryZone
 totalOrders
 threshold
 status
 batch
 */
const batchGroupSchema = new mongoose.Schema(
    {

        slot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
            required: true
        },

        restaurantZone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
            required: true
        },

        deliveryZone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
            required: true
        },

        totalOrders: {
            type: Number,
            default: 0
        },

        threshold: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["collecting", "batched"],
            default: "collecting"
        },

        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
        }
    },
    {
        timestamps: true
    }
);

// index
batchGroupSchema.index(
    {
        slot: 1,
        restaurantZone : 1,
        deliveryZone : 1
    },
    {
        unique: true
    }
);

const BatchGroup = mongoose.model("BatchGroup", batchGroupSchema);
export default BatchGroup;