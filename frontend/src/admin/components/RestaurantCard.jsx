function RestaurantCard({ restaurant, onClick }) {
    return (
        <div
            className="restaurant-card"
            onClick={() => onClick(restaurant)}
        >

            <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-card-image"
            />

            <div className="restaurant-card-info">

                <h3>{restaurant.name}</h3>

                <p className="restaurant-zone">
                    📍 {restaurant.zone.name}
                </p>

                <span className="restaurant-items">
                    {restaurant.menu.length} Items
                </span>

            </div>

        </div>
    );
}

export default RestaurantCard;