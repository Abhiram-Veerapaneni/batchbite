import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// {
//     name,
//     phone,
//     zones [],
//     currentBatch,
//     status
// }

const agentSchema = new mongoose.Schema(
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
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        phone: {
            type: String,
            required: true
        },

        zones: [
            {
                type: String
            }
        ],

        currentBatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            default: null
        },

        status: {
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
        timestamps: true
    }
)


// Hash password
agentSchema.pre("save", async function () {

    // prevent rehashing when updating
    if(!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});

// compare passwords 
agentSchema.methods.matchPassword = async function(enteredPassword) {

    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};

const Agent = mongoose.model("Agent", agentSchema);
export default Agent;