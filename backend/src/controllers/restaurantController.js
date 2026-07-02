import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

// get all restaurants (filtered by uni/zone)

export const getRestaurants = async (req, res) => {

    try {

        const restaurants = await Restaurant
            .find()
            .populate("zone")
        res.json(restaurants);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get single restaurant menu
export const getRestaurantById = async (req, res) => {

    try {

        const restaurant = await Restaurant
            .findById(req.params.id)
            .populate("zone")

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        // Send restaurant data back
        res.json(restaurant);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// BACKEND APIs for user.role = "RESTAURANT"

// GET /api/restaurants/dashboard
// export const getRestaurantDashboard = async (req, res) => {

//     try {

//         const orders = 
//     } catch (error) {
//         return res.json({
//             message: error.message
//         })
//     }
// }

// MENU management

// GET    /api/restaurants/menu
export const getMenu = async (req, res) => {

    try {

        const restaurant = await Restaurant.findById(req.account._id)
            .select("menu");

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        return res.status(200).json(restaurant.menu);

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

// POST   /api/restaurants/menu
export const updateMenu = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            isVeg
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required"
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer
        );

        await Restaurant.findByIdAndUpdate(
            req.account._id,
            {
                $push: {
                    menu: {
                        name,
                        description,
                        image: result.secure_url,
                        imagePublicId: result.public_id,
                        price,
                        category,
                        isVeg
                    }
                }
            }
        );

        return res.status(201).json({
            message: "Menu item added successfully"
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};

// PATCH  /api/restaurants/menu/:itemId
export const updateMenuItem = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            isVeg,
            isAvailable
        } = req.body;

        const restaurant = await Restaurant.findById(
            req.account._id
        );

        const menuItem = restaurant.menu.id(
            req.params.itemId
        );

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        menuItem.name = name ?? menuItem.name;
        menuItem.description = description ?? menuItem.description;
        menuItem.price = price ?? menuItem.price;
        menuItem.category = category ?? menuItem.category;
        menuItem.isVeg = isVeg ?? menuItem.isVeg;
        menuItem.isAvailable = isAvailable ?? menuItem.isAvailable;

        if (req.file) {

            if (menuItem.imagePublicId) {

                await cloudinary.uploader.destroy(
                    menuItem.imagePublicId
                );

            }

            const result = await uploadToCloudinary(
                req.file.buffer
            );

            menuItem.image = result.secure_url;
            menuItem.imagePublicId = result.public_id;

        }

        await restaurant.save();

        return res.status(200).json({
            message: "Menu item updated successfully",
            menuItem
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};

// DELETE /api/restaurants/menu/:itemId
export const deleteMenuItem = async (req, res) => {

    try {

        const restaurant = await Restaurant.findById(
            req.account._id
        );

        const menuItem = restaurant.menu.id(
            req.params.itemId
        );

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        if (menuItem.imagePublicId) {

            await cloudinary.uploader.destroy(
                menuItem.imagePublicId
            );

        }

        await menuItem.deleteOne();

        await restaurant.save();

        return res.status(200).json({
            message: "Menu item deleted successfully"
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};

// PATCH /api/restaurants/menu/:itemId/toggle -> change availablity
export const toggleAvailability = async (req, res) => {

    try {

        const restaurant = await Restaurant.findById(req.account._id);

        const menuItem = restaurant.menu.id(req.params.itemId);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        menuItem.isAvailable = !menuItem.isAvailable;

        await restaurant.save();

        res.status(200).json(menuItem);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// GET /api/restaurants/orders/:orderId
export const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            "items.restaurantId": req.account._id
        })
            .select({
                totalAmount: 0,
                canModifyUntil: 0,
                paymentMethod: 0,
                paymentStatus: 0,
                shiftCount: 0,
                batch: 0
            })
            .populate("user", "name email university")
            .populate("slot", "startTime endTime")
            .populate("deliveryZone");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const items = order.items.filter(item =>
            item.restaurantId.equals(req.account._id)
        );

        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        return res.status(200).json({
            ...order.toObject(),
            items,
            totalAmount
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// GET /api/restaurants/orders/today
export const getTodaysOrders = async (req, res) => {

    try {

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            "items.restaurantId": req.account._id,
            updatedAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
            .select({
                totalAmount: 0,
                canModifyUntil: 0,
                paymentMethod: 0,
                paymentStatus: 0,
                shiftCount: 0,
                batch: 0
            })
            .populate("user", "name email university")
            .populate("slot", "startTime endTime")
            .populate("deliveryZone")

        // return only items of this restuarant
        const result = orders.map(order => {

            const items = order.items.filter(
                item => item.restaurantId.equals(req.account._id)
            );

            const totalAmount = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            return {
                ...order.toObject(),
                items,
                totalAmount
            };
        });

        return res.status(200).json(result);

    } catch (error) {
        return res.status(200).json({
            message: error.message
        })
    }
}

export const getRestaurantOrderHistory = async (req, res) => {

    try {

        const orders = await Order.find({
            "items.restaurantId": req.account._id,
            "deliveryStatus": { $in: ["delivered", "cancelled"] }
        })
            .select({
                totalAmount: 0,
                canModifyUntil: 0,
                paymentMethod: 0,
                paymentStatus: 0,
                shiftCount: 0,
                batch: 0,
                batchStatus: 0
            })
            .populate("user", "name email university")
            .populate("slot", "startTime endTime")
            .populate("deliveryZone")

        let deliveredAmount = 0, deliverdOrders = 0
        let cancelledAmount = 0, cancelledOrders = 0
        const result = orders.map(order => {

            const items = order.items.filter(
                item => item.restaurantId.equals(req.account._id)
            );

            const totalAmount = items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            );

            if (order.deliveryStatus === "delivered") {
                deliverdOrders++;
                deliveredAmount += totalAmount
            } else {
                cancelledOrders++;
                cancelledAmount += totalAmount
            }

            return {
                ...order.toObject(),
                items,
                totalAmount
            }
        })

        return res.status(200).json({
            totalOrders: result,
            deliverdOrders,
            deliveredAmount,
            cancelledOrders,
            cancelledAmount
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getRestaurantProfile = async (req, res) => {

    try {

        const restaurant = await Restaurant.findById(req.account._id)
            .populate("zone", "name");

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const updateRestaurantProfile = async (req, res) => {

    try {

        const restaurant = await Restaurant.findById(req.account._id);

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const {
            name,
            phone
        } = req.body;

        restaurant.name = name ?? restaurant.name;
        restaurant.phone = phone ?? restaurant.phone;

        if (req.file) {

            if (restaurant.imagePublicId) {
                await cloudinary.uploader.destroy(
                    restaurant.imagePublicId
                );
            }

            const result = await uploadToCloudinary(
                req.file.buffer
            );

            restaurant.image = result.secure_url;
            restaurant.imagePublicId = result.public_id;

        }

        await restaurant.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            restaurant
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

// PATCH /api/restaurants/change-password
export const changeRestaurantPassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const restaurant = await Restaurant.findById(
            req.account._id
        ).select("+password");

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const isMatch = await restaurant.matchPassword(
            currentPassword
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        restaurant.password = newPassword;

        await restaurant.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};