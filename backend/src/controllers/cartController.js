import Cart from "../models/Cart.js";

// GET api/cart
export const getCart = async (req, res) => {

    try {

        let cart = await Cart.findOne({ user: req.user._id });
        res.json(cart);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// POST api/add
export const addToCart = async (req, res) => {

    try {

        const { item, restaurantId } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        // different restaurant -> clear old cart
        if (!cart.restaurant || cart.restaurant.toString() !== restaurantId) {

            if (cart.restaurant) {
                cart.items = [];
            }

            cart.restaurant = restaurantId;
        }

        // find existing item
        const existingItem = cart.items.find(
            (i) => i.itemId.toString() === item._id
        )

        if (existingItem) {
            existingItem.quantity++;
        } else {

            cart.items.push({
                itemId: item._id,
                name: item.name,
                image: item.image,
                restaurantName: item.restaurantName,
                isVeg: item.isVeg,
                price: item.price,
                quantity: 1
            });
        }

        await cart.save();
        res.json(cart);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// PATCH api/cart/increase/:itemId
export const increaseQuantity = async (req, res) => {

    try {

        const cart = await Cart.findOne({ user: req.user._id });

        const item = cart.items.find(
            (i) => i.itemId.toString() === req.params.itemId
        )

        if (!item) {

            return res.status(404).json({
                message: "Item not found"
            });
        }

        item.quantity++;
        await cart.save();
        res.json(cart);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// PATCH api/cart/decrease/:itemId
export const decreaseQuantity = async (req, res) => {

    try {
        const cart = await Cart.findOne({ user: req.user._id });

        const item = cart.items.find(
            (i) => i.itemId.toString() === req.params.itemId
        )

        if (!item) {

            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.quantity === 1) {
            // remove that and return remaining items
            cart.items = cart.items.filter(
                (i) => i.itemId.toString() !== req.params.itemId
            )
        } else {

            item.quantity--;
        }

        if (cart.items.length == 0) {
            cart.restaurant = null;
        }

        await cart.save();
        res.json(cart);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// DELETE /api/cart
export const clearCart = async (req, res) => {

    try {
        const cart = await Cart.findOne({
            user: req.user._id
        });


        cart.items = [];
        cart.restaurant = null;
        await cart.save();
        res.json({
            message: "Cart cleared"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}