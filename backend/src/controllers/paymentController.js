import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createRazorpayOrderService,
    refundPaymentService,
    verifyRazorpayPaymentService
} from "../services/paymentService.js";

import Order from "../models/Order.js";
import { ApiError } from "../utils/apiError.js";
import { createOrder } from "./orderController.js";
import { settleRestaurantLedger } from "../services/settlementService.js";

export const createPaymentOrder = asyncHandler(async (req, res) => {

    try {
        const DELIVERY_CHARGE = 50;
        const userId = req.account._id;
        const orderData = req.body;

        // console.log(req.body);
        // console.log(orderData.items);
        // calculate total amount to verify
        let amount = orderData.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )

        amount += DELIVERY_CHARGE;

        if (orderData.totalAmount !== amount) {
            return res.status(400).json({
                message: "Amount mismatch"
            })
        }

        const { razorpayOrder, payment } =
            await createRazorpayOrderService({
                userId,
                amount,
                notes: {
                    slotId: orderData.slot
                }
            });

        return res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order: razorpayOrder,
            paymentId: payment._id
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
});

// verify and create order with idempotency protection
export const verifyPayment = asyncHandler(async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData // from frontend
    } = req.body;

    // 1. Verify Razorpay cryptographic signature
    const payment = await verifyRazorpayPaymentService({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });

    // 2. Idempotency Check: if this payment is already linked to an order, return existing order immediately
    if (payment.order) {
        const existingOrder = await Order.findById(payment.order);
        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Payment already verified & Order already placed",
                order: existingOrder
            });
        }
    }

    // 3. Check if an order was already created with this razorpay_order_id as idempotencyKey
    const existingOrderByKey = await Order.findOne({ idempotencyKey: razorpay_order_id });
    if (existingOrderByKey) {
        if (!payment.order) {
            payment.order = existingOrderByKey._id;
            await payment.save();
        }
        return res.status(200).json({
            success: true,
            message: "Payment already verified & Order already placed",
            order: existingOrderByKey
        });
    }

    // 4. First time processing: create order with razorpay_order_id as idempotencyKey
    const order = await createOrder({
        user: req.account,
        ...orderData,
        payment,
        idempotencyKey: razorpay_order_id
    });

    payment.order = order._id;
    await payment.save();

    return res.status(200).json({
        success: true,
        message: "Payment verified & Order created",
        order
    });

});

export const refundPayment = asyncHandler(async (req, res) => {

    const { orderId } = req.body;

    console.log(req.body);
    const order = await Order.findById(orderId)
        .populate("payment");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.batchStatus === "batched") {

        throw new ApiError(400, "Order cannot be refunded after it is batched")
    }

    if(order.batchStatus !== "cancelled" || 
        order.deliveryStatus !== "cancelled") {
            throw new ApiError(400, "Order is not cancelled")
        }

    const payment = order.payment;

    if (!payment || payment.status !== "paid") {
        throw new ApiError(400, "Invalid payment state")
    }

    // mark
    payment.refundStatus = "processing";
    await payment.save();

    // razorpay service
    const refund = await refundPaymentService({
        payment,
        amount: payment.amount
    });

    // update payment
    payment.refundStatus = "success";
    payment.razorpayRefundId = refund.id
    payment.refundAmount = refund.amount / 100;
    payment.status = "refunded";

    await payment.save();

    // update order
    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
        success: true,
        message: "Refund successful",
        refund
    });

})

// settle payments
export const settleLedger = asyncHandler(async (req, res) => {

    const { ledgerId } = req.params;

    const ledger = await settleRestaurantLedger(ledgerId);

    return res.status(200).json({
        success: true,
        message: "Restaurant settled successfully.",
        settlement: ledger
    });

});
