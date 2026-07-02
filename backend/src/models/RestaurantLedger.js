import mongoose from "mongoose";

// restaurantId,
//   orderId,
//   grossAmount,
//   platformFee,
//   deliveryFee,
//   netAmount,
//   status: "pending | payable | paid"
const RestaurantLedgerSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        restaurantId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        },

        orderId : {
            type: mongoose.Schema.Types.ObjectId
        },

        grossAmount : Number,
        platformFee: Number,
        deliveryFee: Number,
        netAmount: Number,
        status: {
            type: String,
            enum: [
                "pending",
                "payable",
                "paid"
            ],
            default: "pending"
        } 
    },
    {
        timestamps: true
    }
)