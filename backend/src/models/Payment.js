import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            default: "INR"
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed", "refunded"],
            default: "created"
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },

        refundStatus: { // only for student
            type: String,
            enum: ["not_requested", "requested", "processing", "success", "failed"],
            default: "not_requested"
        },

        razorpayRefundId: String,
        refundAmount: Number

    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);