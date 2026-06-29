function RestaurantMenuModal({ restaurant, onClose }) {

    return (
        <div className="modal-overlay">
            <div className="modal">

                <div className="modal-header">
                    <h2>{restaurant.name}</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                <p>
                    <strong>Zone:</strong> {restaurant.zone?.name}
                </p>

                <h3>Menu</h3>

                {restaurant.menu.length === 0 ? (
                    <p>No menu items available.</p>
                ) : (
                    <div className="menu-list">
                        {restaurant.menu.map(item => (

                            <div
                                className="menu-item"
                                key={item._id}
                            >

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="menu-image"
                                />

                                <div className="menu-info">

                                    <h4>{item.name}</h4>

                                    <div className="menu-price">
                                        ₹ {item.price}
                                    </div>

                                    {item.description &&
                                        <p className="menu-description">
                                            {item.description}
                                        </p>
                                    }

                                    <div className="menu-badges">

                                        <span className="badge badge-category">
                                            {item.category}
                                        </span>

                                        <span
                                            className={`badge ${item.isVeg
                                                    ? "badge-veg"
                                                    : "badge-nonveg"
                                                }`}
                                        >
                                            {item.isVeg ? "Veg" : "Non-Veg"}
                                        </span>

                                        <span
                                            className={`badge ${item.isAvailable
                                                    ? "badge-available"
                                                    : "badge-unavailable"
                                                }`}
                                        >
                                            {item.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default RestaurantMenuModal;