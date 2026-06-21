import mongoose from "mongoose";

// {
//     name,
//     phone,
//     regions,
//     currentBatch,
//     status
// }

const agentSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true
        },

        phone : {
            type: String,
            required: true
        },

        regions : [
            {
                type: String
            }
        ],

        currentBatch : {
            type: mongoose.Schema.Types.objectId,
            ref: "Batch",
            default: null
        },

        status : {
            type: String,
            enum: [
                "available",
                "busy",
                "offline"
            ],
            default: "available"
        }
        
    },
    {
        timestamps = true
    }
)

const Agent = mongoose.model("Agent", agentSchema);
export default Agent;