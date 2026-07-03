import crypto from "crypto";
import { ApiError } from "../utils/apiError.js";

import Payment from "../models/Payment.js";

import getRazorpayInstance from "../config/razorpay.js";

const razorpay = getRazorpayInstance();

export const createRazorpayOrderService = async ({
    userId,
    amount,
    notes = {}
}) => {

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
            userId: userId.toString(),
            ...notes
        }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // create payment record
    const payment = await Payment.create({
        user: userId,
        razorpayOrderId: razorpayOrder.id,
        amount
    });

    return {
        razorpayOrder,
        payment
    };
};


export const verifyRazorpayPaymentService = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
}) => {

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Invalid payment signature");
    }

    const payment = await Payment.findOne({
        razorpayOrderId: razorpay_order_id
    });

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";

    await payment.save();

    return payment;
};

export const refundPaymentService = async ({ payment, amount }) => {

    if (payment.status !== "paid") {
        throw new ApiError(400, "Payment not eligible for refund");
    }

    const refund = await razorpay.payments.refund(
        payment.razorpayPaymentId,
        {
            amount: amount * 100 // paise
        }
    );

    return refund;
};
