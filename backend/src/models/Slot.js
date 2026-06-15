import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },


    totalOrders: {
        type: Number,
        default: 0
    },

    threshold: {
        type: Number,
        default: 25
    },

    status: {
        type: String,
        enum: [
            "open",
            "closed",
            "out_for_delivery",
            "processed"
        ],
        default: "open"
    }

});

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;