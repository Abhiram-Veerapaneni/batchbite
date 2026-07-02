import "../styles/MenuItemCard.css";

function MenuItemCard({
    item,
    onEdit,
    onDelete,
    onToggleAvailability
}) {

    return (

        <div className="mic-card">

            <div className="mic-image-wrapper">

                <img
                    src={item.image}
                    alt={item.name}
                    className="mic-image"
                />

            </div>

            <div className="mic-content">

                <div className="mic-header">

                    <div>

                        <h3 className="mic-name">
                            {item.name}
                        </h3>

                        <p className="mic-description">
                            {item.description}
                        </p>

                    </div>

                    <div className="mic-price">
                        ₹{item.price}
                    </div>

                </div>

                <div className="mic-meta">

                    <span className="mic-category">
                        {item.category}
                    </span>

                    <span
                        className={`mic-badge ${item.isVeg
                                ? "mic-veg"
                                : "mic-nonveg"
                            }`}
                    >
                        {item.isVeg ? "Veg" : "Non-Veg"}
                    </span>

                    <span
                        className={`mic-badge ${item.isAvailable
                                ? "mic-available"
                                : "mic-unavailable"
                            }`}
                    >
                        {item.isAvailable
                            ? "Available"
                            : "Unavailable"}
                    </span>

                </div>

                <div className="mic-actions">

                    <label className="mic-switch">

                        <input
                            type="checkbox"
                            checked={item.isAvailable}
                            onChange={() =>
                                onToggleAvailability(item)
                            }
                        />
                        {/* <div className="mic-toggle">
                            <span>Available</span>
                            <label className="mic-switch">
                                ...
                            </label>
                        </div> */}

                        <span className="mic-slider"></span>

                    </label>

                    <button
                        className="mic-edit-btn"
                        onClick={() => onEdit(item)}
                    >
                        ✏ Edit
                    </button>

                    <button
                        className="mic-delete-btn"
                        onClick={() => onDelete(item)}
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default MenuItemCard;