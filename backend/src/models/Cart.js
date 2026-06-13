import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema (

    {
        itemId : {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        image: String,

        restaurantName: String,

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

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        },

        items: [cartItemSchema]
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;