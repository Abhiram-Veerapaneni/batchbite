import BatchGroup from "../models/BatchGroup.js";
import Order from "../models/Order.js";
import Slot from "../models/Slot.js";

import {
    incrementBatchGroup,
    decrementBatchGroup,
    moveOrderBetweenBatchGroup,
} from "../services/batchGroupService.js";

import { ApiError } from "../utils/apiError.js";

import { createRestaurantLedgers, updateRestaurantLedgerStatus } from "./restaurantLedgerController.js";

// Create order -> service after payment is done
export const createOrder = async (orderData) => {

    const {
        user,
        restaurantZone,
        items,
        slot,
        deliveryZone,
        totalAmount,
        paymentMethod,
        payment
    } = orderData;

    // Validation
    if (
        !restaurantZone ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !slot ||
        !deliveryZone ||
        totalAmount == null ||
        !paymentMethod
    ) {
        throw new ApiError(400, "Missing required fields");
    }

    // Payment status
    const paymentStatus = (paymentMethod === "upi") ? "paid" : "pending";

    // find slot 
    const slotDoc = await Slot.findById(slot);

    if (!slotDoc) {
        throw new ApiError(404, "Slot not found");
    }
    // Create order
    const order = await Order.create({
        user,
        restaurantZone,
        items: items.map((item) => ({
            restaurantId: item.restaurantId,
            itemId: item.itemId,
            name: item.name,
            image: item.image,
            isVeg: item.isVeg,
            price: item.price,
            quantity: item.quantity,
            restaurantName: item.restaurantName,
        })),
        slot,
        deliveryZone,
        totalAmount,
        canModifyUntil: slotDoc.startTime.getTime() + 5 * 60 * 1000,
        paymentMethod,
        paymentStatus,
        payment
    });

    await incrementBatchGroup(order, slotDoc);
    await createRestaurantLedgers(order); // with status = "pending"

    return order;
};

// Get order history
export const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.account._id
        })
            .populate("slot")
            .populate("deliveryZone")
            .populate("restaurantZone")
            .populate("payment")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//  for deletion/modification of order -> lets change status to "cancelled"
// api/orders/:id

export const modifySlot = async (req, res) => {

    try {

        // recives => new slot in the body
        const { slotId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({
                message: "Order not found"
            })
        }

        if (order.canModifyUntil && new Date() > order.canModifyUntil) {

            return res.status(400).json({
                message: "Modification window expired"
            })
        }

        // same slot
        if (order.slot.toString() === slotId) {
            return res.status(400).json({
                message: "Order already belongs to this slot"
            })
        }

        const oldSlot = await Slot.findById(order.slot);
        const newSlot = await Slot.findById(slotId);

        if (!newSlot) {
            return res.status(400).json({
                message: "Selected slot not found"
            })
        }

        await oldSlot.save();
        await newSlot.save();

        // update totalOrders in old BatchGroup
        await decrementBatchGroup(order);

        // shift into new BatchGroup
        await moveOrderBetweenBatchGroup(order, newSlot);

        // move order
        order.slot = slotId;
        order.canModifyUntil = newSlot.startTime.getTime() + 5 * 60 * 1000
        order.shiftCount++;
        await order.save();

        res.status(200).json({
            message:
                "Slot updated successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// cancel/:id
export const cancelOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id).populate("payment");

        if (!order) {
            res.status(404).json({
                message: "Order not found"
            })
        }

        // remove this later
        if (
            order.deliveryStatus === "out_for_delivery" ||
            order.deliveryStatus === "delivered"
        ) {
            return res.status(400).json({
                message: "Order cannot be cancelled"
            });
        }

        if (order.canModifyUntil && new Date() > order.canModifyUntil) {

            return res.status(400).json({
                message: "Cancellation window expired"
            })
        }

        order.batchStatus = "cancelled";
        order.deliveryStatus = "cancelled";
        order.canModifyUntil = new Date();
        const payment = order.payment;
        payment.refundStatus = "requested";

        await payment.save();
        await order.save();

        // decrease total orders in BatchGroup
        await decrementBatchGroup(order);
        // cancel restaurant Ledgers
        await updateRestaurantLedgerStatus(order, "cancelled");

        return res.status(200).json({
            message: "Order cancelled successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}