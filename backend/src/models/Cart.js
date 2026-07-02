import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(

    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
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

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        restaurantZone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone"
        },

        items: [cartItemSchema]
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;