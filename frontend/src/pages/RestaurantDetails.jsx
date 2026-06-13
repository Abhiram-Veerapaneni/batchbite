import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { CartContext } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

function RestaurantDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRestaurant = async () => {

            try {

                const res = await axios.get(
                    `${API_URL}/restaurants/${id}`
                );

                setRestaurant(res.data);

            } catch (error) {

                console.error("Failed to fetch restaurant:", error);

            } finally {

                setLoading(false);

            }
        };

        fetchRestaurant();

    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="loading-state">

                <div className="loading-icon">
                    🍽️
                </div>

                <h2>
                    Loading menu...
                </h2>

            </div>
        );
    }

    // Restaurant not found
    if (!restaurant) {
        return (
            <div className="empty-menu">

                <div className="empty-menu-icon">
                    ❌
                </div>

                <h2>
                    Restaurant not found
                </h2>

                <p>
                    Please try again later.
                </p>

            </div>
        );
    }

    return (

        <div className="restaurant-details-page">

            {/* Restaurant Info */}
            <div className="restaurant-header">

                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="restaurant-header-image"
                />

                <div className="restaurant-header-info">

                    <h1 className="restaurant-name">
                        {restaurant.name}
                    </h1>

                    <p className="restaurant-region">
                        {restaurant.region}
                    </p>

                </div>

            </div>

            {/* Menu */}
            <div className="menu-section">

                <h2 className="menu-heading">
                    Menu
                </h2>

                {restaurant?.menu?.length === 0 ? (

                    <div className="empty-menu">

                        <div className="empty-menu-icon">
                            🍽️
                        </div>

                        <h2>
                            No menu items available
                        </h2>

                        <p>
                            Please check again later.
                        </p>

                    </div>

                ) : (

                    <div className="food-grid">

                        {restaurant.menu.map((item) => (

                            <div
                                key={item._id}
                                className="food-card"
                                onClick={() =>
                                    navigate(`/food/${item._id}`)
                                }
                            >

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="food-card-image"
                                />

                                <div className="food-card-body">

                                    <h3 className="food-card-name">
                                        {item.name}
                                    </h3>

                                    <p className="food-card-description">
                                        {item.description}
                                    </p>

                                    <p className="food-card-price">
                                        ₹{item.price}
                                    </p>

                                    <p className="food-card-type">

                                        {item.isVeg
                                            ? "🟢 Veg"
                                            : "🔴 Non-Veg"}

                                    </p>

                                    <button
                                        className="add-to-cart-btn"
                                        onClick={(e) => {

                                            // Prevent card click navigation
                                            e.stopPropagation();

                                            addToCart(
                                                item,
                                                restaurant._id
                                            );
                                        }}
                                    >
                                        Add
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default RestaurantDetails;