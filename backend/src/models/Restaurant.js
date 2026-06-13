import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    isVeg: {
        type: Boolean,
        default: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    }
});

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        universities: {
            type: [String],
            required: true
        },

        region: {
            type: String,
            required: true
        },

        menu: [menuItemSchema]
    },
    {
        timestamps: true
    }
);

const Restaurant = mongoose.model(
    "Restaurant",
    restaurantSchema
);

export default Restaurant;