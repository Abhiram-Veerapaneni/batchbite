import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        image: String,

        isVeg: Boolean,

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            default: 1
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },

        items: [orderItemSchema],

        slot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
            required: true
        },

        totalAmount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "shifted",
                "out_for_delivery",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        },

        canModifyUntil: {
            type: Date
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "upi"],
            default: "cod"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending"
        },

        shiftCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;