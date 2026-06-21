import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },

    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    }

});

const Zone = mongoose.model("Zone" , zoneSchema);
export default Zone;