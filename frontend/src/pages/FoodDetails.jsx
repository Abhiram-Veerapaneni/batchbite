import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { CartContext } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

function FoodDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    const [foodItem, setFoodItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchFoodItems = async () => {

            try {

                const response = await axios.get(
                    `${API_URL}/menu-items/${id}`
                );
                setFoodItem(response.data);
                setLoading(false);

            } catch (error) {
                console.log(error);
            }
        }

        fetchFoodItems();

    }, [id]);

    if (loading || !foodItem) {
        return (
            <div className="loading-state">
                <div className="loading-icon">
                    🍽️
                </div>

                <h2>Loading food details...</h2>
            </div>
        );
    }

    return (
        <div className="food-details-page">

            <div className="food-details-container">

                <img
                    src={foodItem.image}
                    alt={foodItem.name}
                    className="food-details-image"
                />

                <div className="food-details-info">

                    <h1 className="food-details-name">
                        {foodItem.name}
                    </h1>

                    <p className="food-details-description">
                        {foodItem.description}
                    </p>

                    <h2 className="food-details-price">
                        ₹{foodItem.price}
                    </h2>

                    <p className="food-details-restaurant">
                        Restaurant: {foodItem.restaurantName}
                    </p>

                    <p className="food-details-zone">
                        Zone: {foodItem.restaurantZone.name}
                    </p>

                    <p className="food-details-type">
                        {foodItem.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                    </p>

                    <button
                        className="add-to-cart-btn"
                        onClick={() =>
                            addToCart(foodItem)
                        }
                    >
                        Add To Cart
                    </button>

                    <button
                        className="view-cart-btn"
                        onClick={() => navigate("/cart")}
                    >
                        View Cart
                    </button>

                    <button
                        className="more-items-btn"
                        onClick={() =>
                            navigate(
                                `/restaurants/${foodItem.restaurantId}`
                            )
                        }
                    >
                        More Items From This Restaurant
                    </button>

                </div>

            </div>

        </div>
    );
}

export default FoodDetails