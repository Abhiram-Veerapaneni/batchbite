import { useEffect, useState } from "react";
import axios from "axios";

import FoodCard from "../components/FoodCard";
import RestaurantCard from "../components/RestaurantCard";
import LiveBatchCard from "../components/LiveBatchCard";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [searchResults, setSearchResults] = useState({
        restaurants: [],
        menuItems: []
    });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/restaurants`
                );

                setRestaurants(res.data);

                const items = [];

                res.data.forEach((restaurant) => {
                    restaurant.menu.forEach((item) => {
                        items.push({
                            ...item,
                            restaurantId: restaurant._id,
                            restaurantName: restaurant.name,
                            restaurantZone: restaurant.zone
                        });
                    });
                });

                setFeaturedItems(items);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Search with 500ms delay
    useEffect(() => {
        if (search.trim().length === 0) return;

        if (!search.trim()) {
            setSearchResults({
                restaurants: [],
                menuItems: []
            });

            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/search?q=${search}`
                );

                setSearchResults(res.data);
            } catch (error) {
                console.log(error);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-icon">⌛</div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-content">
                
                <LiveBatchCard />

                <div className="search-section">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search food or restaurants..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                {search ? (
                    <>
                        <h2 className="section-heading">
                            Matching Menu Items
                        </h2>

                        <div className="food-grid">
                            {searchResults.menuItems.map( (item) => (
                                    <FoodCard key={item._id} item={item} />
                                )
                            )}
                        </div>

                        <h2 className="section-heading">
                            Matching Restaurants
                        </h2>

                        <div className="restaurant-grid">
                            {searchResults.restaurants.map( (restaurant) => (
                                    <RestaurantCard key={restaurant._id} restaurant={ restaurant } />
                                )
                            )}
                        </div>

                        {searchResults.menuItems.length === 0 
                            && searchResults.restaurants.length === 0 && (
                                <div className="empty-search">
                                    <div className="empty-search-icon">
                                        🔍
                                    </div>
                                    <h2>No items found</h2>
                                    <p>
                                        Try another
                                        keyword.
                                    </p>
                                </div>
                            )}
                    </>
                ) : (
                    <>
                        <div className="featured-section">
                            <h2 className="section-heading">
                                Featured Items
                            </h2>

                            <div className="food-grid">
                                {featuredItems.map( (item) => (
                                        <FoodCard key={item._id} item={item} />
                                    )
                                )}
                            </div>
                        </div>

                        <div className="restaurant-section">
                            <h2 className="section-heading">
                                Restaurants
                            </h2>

                            <div className="restaurant-grid">
                                {restaurants.map( (restaurant) => (
                                        <RestaurantCard key={ restaurant._id } restaurant={ restaurant } />
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;