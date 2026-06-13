import Restaurant from "../models/Restaurant.js";

// get all restaurants (filtered by uni/region)

export const getRestaurants = async (req, res) => {

    try {

        const restaurants = await Restaurant.find();
        res.json(restaurants);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get single restaurant menu
export const getRestaurantById = async (req, res) => {

    try {

        const restaurant = await Restaurant.findById(req.params.id);

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