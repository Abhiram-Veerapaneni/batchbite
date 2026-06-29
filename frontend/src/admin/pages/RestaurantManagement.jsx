import { useEffect, useState } from "react";
import { getRestaurants } from "../services/restaurantService";
import RestaurantMenuModal from "../components/RestaurantMenuModal";
import RestaurantCard from "../components/RestaurantCard";

function RestaurantManagement() {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRestaurants(); // Wait for the Promise
                setRestaurants(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div>
            {
                restaurants.map(restaurant => (
                    <RestaurantCard
                        key={restaurant._id}
                        restaurant={restaurant}
                        onClick={setSelectedRestaurant}
                    />
                ))
            }

            {
                selectedRestaurant && (
                    <RestaurantMenuModal
                        restaurant={selectedRestaurant}
                        onClose={() => setSelectedRestaurant(null)}
                    />
                )
            }
        </div>
    )
}

export default RestaurantManagement;