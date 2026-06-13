import Restaurant from "../models/Restaurant.js";

export const search = async (req, res) => {

    try {
        
        const query = req.query.q;

        if(!query) {

            return res.json({
                restaurants: [],
                menuItems: []
            });
        }

        // Restaurant search
        const restaurants = await Restaurant.find({
            name: {
                $regex : query,
                $options: "i"
            }
        });

        // Menu items search
        const menuRestaurants = await Restaurant.find({
            "menu.name" : {
                $regex: query,
                $options: "i"
            }
        });

        const menuItems = [];
        menuRestaurants.forEach((restaurant) => {

            restaurant.menu.forEach((item) => {
                if (
                    item.name
                        .toLowerCase()
                        .includes(query.toLowerCase())
                ) {

                    menuItems.push({
                        ...item.toObject(),

                        restaurantId: restaurant._id,
                        restaurantName: restaurant.name,
                        region: restaurant.region
                    });
                }
            })
        })

        res.json({
            restaurants, menuItems
        })

    } catch (error) {
        
        res.status(500).json({
            message: error.message
        });
    }

}