import Order from "../models/Order.js";
import Slot from "../models/Slot.js";

// Create order
export const createOrder = async (req, res) => {
    try {

        const {
            restaurant,
            items,
            slot,
            totalAmount,
            paymentMethod
        } = req.body;

        // Validation
        if (
            !restaurant ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !slot ||
            totalAmount == null ||
            !paymentMethod
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // Payment status
        const paymentStatus =
            paymentMethod === "upi"
                ? "paid"
                : "pending";


        // find slot and increase total orders
        const slotDoc = await Slot.findByIdAndUpdate(
            slot,
            { $inc: { totalOrders: 1 } },
            { new: true }
        );

        if (!slotDoc) {
            return res.status(404).json({ message: "Slot not found" });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            restaurant,
            items: items.map((item) => ({
                itemId: item.itemId,
                name: item.name,
                image: item.image,
                isVeg: item.isVeg,
                price: item.price,
                quantity: item.quantity
            })),
            slot,
            totalAmount,
            canModifyUntil: slotDoc.startTime.getTime() + 5 * 60 * 1000,
            paymentMethod,
            paymentStatus
        });


        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get order history
export const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user._id
        })
            .populate("slot")
            .populate("restaurant")
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

        // oldSlot
        const oldSlot = await Slot.findById(order.slot);

        // newSlot
        const newSlot = await Slot.findById(slotId);

        if (!newSlot) {
            return res.status(400).json({
                message: "Selected slot not found"
            })
        }

        // update totalorders
        oldSlot.totalOrders--;
        newSlot.totalOrders++;

        await oldSlot.save();
        await newSlot.save();

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

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({
                message: "Order not found"
            })
        }

        // remove this later
        if (
            order.status === "out_for_delivery" ||
            order.status === "delivered"
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

        order.status = "cancelled";

        await order.save();

        // decrease total orders
        await Slot.findByIdAndUpdate(
            order.slot,
            {
                $inc: {
                    totalOrders: -1
                }
            }
        );
        
        return res.status(200).json({
            message: "Order cancelled successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}