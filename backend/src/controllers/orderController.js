import Order from "../models/Order.js";

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