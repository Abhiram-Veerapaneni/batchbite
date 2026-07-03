import RestaurantLedger from "../models/RestaurantLedger.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateRestaurantLedgerStatus = async (order, status) => {

    const restaurantLedger = await RestaurantLedger.findOneAndUpdate(
        {
            orderId: order._id
        },
        {
            $set: {
                status: `${status}`
            }
        },
        {
            new: true
        }
    )

    return restaurantLedger;
}

const deliveryFee = process.env.DELIVERY_FEE;
const platformFee = process.env.PLATFORM_FEE;

export const createRestaurantLedgers = async (order) => {

    const userId = order.userId;

    const ledgers = order.items.map(item => {

        const grossAmount = item.price * item.quantity
        const netAmount = grossAmount - platformFee - deliveryFee;
        return {
            userId : userId,
            restaurantId: item.restaurantId,
            orderId: order._id,
            grossAmount,
            platformFee,
            deliveryFee,
            netAmount
        }
    })

    await RestaurantLedger.insertMany(ledgers);

    return "Restaurant Ledgers Created"
}

// REQUESTS
export const getRestaurantLegers = async (req, res) => {

    try {
        
        let query = {};

        if (req.accountType === "restaurant") {

            query.restaurantId = req.account._id;

        } else if (req.accountType !== "admin") {
            
            throw new ApiError(403, "Unauthorized");

        }

        const ledgers = await RestaurantLedger
            .find(query)
            .populate("userId", "name email")
            .populate("restaurantId", "restaurantName")
            .populate("orderId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: ledgers.length,
            ledgers
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}