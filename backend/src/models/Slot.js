import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
    {
        startTime: {
            type: String, // "08:00"
            required: true
        },

        endTime: {
            type: String, // "08:15"
            required: true
        },

        duration: {
            type: Number, // 15 or 30 (admin controlled)
            required: true,
            default: 15
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;