import mongoose from "mongoose";

// restaurantId,
//   orderId,
//   grossAmount,
//   platformFee,
//   deliveryFee,
//   netAmount,
//   status: "pending | receivable | paid"
const RestaurantLedgerSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId
        },

        grossAmount: Number,
        platformFee: Number,
        deliveryFee: Number,
        netAmount: Number,
        status: {
            type: String,
            enum: [
                "pending",
                "receivable",
                "settled",
                "cancelled"
            ],
            default: "pending"
        },

        settledAt: {
            type: Date,
            default: null
        },

        settlementReference: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

const RestaurantLedger = mongoose.model("RestaurantLedger", RestaurantLedgerSchema);
export default RestaurantLedger;