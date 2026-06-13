import Restaurant from "../models/Restaurant.js";

export const getMenuItemById = async (req, res) => {

    try {

        const { id } = req.params;

        const restaurant = await Restaurant.findOne({
            "menu._id": id
        })


        if (!restaurant) {
            return res.status(404).json({
                message: "Food item not found"
            })
        }

        // find menuitem
        const menuItem = restaurant.menu.id(id)

        // send response
        res.json({
            ...menuItem.toObject(),

            // Additional details needed by frontend
            restaurantId: restaurant._id,
            restaurantName: restaurant.name,
            region: restaurant.region
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}