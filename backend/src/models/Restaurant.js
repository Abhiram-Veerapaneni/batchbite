import bcrypt from "bcryptjs";
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

    imagePublicId: {
        type: String
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

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true,
            select: false // Don't include password in queries by default
        },

        image: {
            type: String,
        },

        imagePublicId: {
            type: String
        },

        zone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone"
        },

        menu: [menuItemSchema]
    },
    {
        timestamps: true
    }
);


restaurantSchema.pre("save", async function () {

    // prevent rehashing when updating
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
})

restaurantSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(
        enteredPassword,
        this.password
    )
}

const Restaurant = mongoose.model(
    "Restaurant",
    restaurantSchema
);

export default Restaurant;