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
        },

        restaurantName: {
            type: String
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

        items: [orderItemSchema],

        slot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
            required: true
        },

        deliveryZone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone"
        },

        restaurantZone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone"
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
            type: Date,
            default: null
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
        },

        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;