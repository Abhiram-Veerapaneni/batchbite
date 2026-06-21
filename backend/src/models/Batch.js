import mongoose from "mongoose";

// {
//     slot,
//     destinationZone,
//     restuarantZone,
//     orders: [],
//     orderCount,
//     threshold,
//     agent,
//     status,
// }

const batchSchema = new mongoose.Schema(
    {

        slot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
            required: true
        },

        deliveryZone: {
            type: String
        },

        restaurantZone: {
            type: String
        },

        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ],

        orderCount: {
            type: Number,
            default: 0

        },

        threshold: {

            type: Number,
            default: 25
        },

        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            default: null
        },

        status: {
            type: String,
            enum: [
                "pending",
                "assinged",
                "out_for_delivery",
                "delivered"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;