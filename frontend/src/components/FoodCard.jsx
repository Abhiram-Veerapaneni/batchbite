import { useNavigate } from "react-router-dom";

function FoodCard({
    item,

    layout = "vertical",

    showRestaurant = true,
    showRegion = true,
    showVegChip = true,

    showControls = false,
    quantity = 0,

    showStatus = false,
    status = "",

    onIncrease,
    onDecrease
}) {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/food/${item.itemId || item._id}`);
    };

    return (

        <div
            className={`food-card ${layout}`}
            onClick={handleCardClick}
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

                <p className="food-card-price">
                    ₹{item.price}
                </p>

                {
                    showRestaurant &&
                    <p className="food-card-restaurant">
                        {item.restaurantName}
                    </p>
                }

                {
                    showRegion &&
                    <p className="food-card-region">
                        {item.region}
                    </p>
                }

                {
                    showVegChip &&
                    (
                        <div
                            className={
                                item.isVeg
                                    ? "food-type-chip veg-chip"
                                    : "food-type-chip nonveg-chip"
                            }
                        >
                            {
                                item.isVeg
                                    ? "Veg"
                                    : "Non-Veg"
                            }
                        </div>
                    )
                }

                {
                    showControls &&
                    (
                        <div
                            className="food-card-controls"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <button
                                className="quantity-btn"
                                onClick={onDecrease}
                            >
                                −
                            </button>

                            <span className="quantity-value">
                                {quantity}
                            </span>

                            <button
                                className="quantity-btn"
                                onClick={onIncrease}
                            >
                                +
                            </button>

                        </div>
                    )
                }

                {
                    showStatus &&
                    (
                        <div
                            className={`food-status ${status}`}
                        >
                            {status}
                        </div>
                    )
                }

            </div>

        </div>

    );
}

export default FoodCard;