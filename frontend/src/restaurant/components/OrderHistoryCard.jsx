import { formatTime } from "../../utils/timeUtils";

function OrderHistoryCard({ order }) {

    return (
        <div className="res-orders-card" >

            <div className="res-orders-left">

                <h3 className="res-orders-user-name">
                    {order.user.name}
                </h3>

                <p className="res-orders-user-email">
                    {order.user.email}
                </p>

                <p className="res-orders-user-university">
                    {order.user.university}
                </p>

                <span className="res-orders-slot">

                    {formatTime(order.slot.startTime)}

                    {" - "}

                    {formatTime(order.slot.endTime)}

                </span>

            </div>

            <div className="res-orders-center">

                <div className="res-orders-items">

                    {order.items.map(item => (

                        <div
                            key={item.itemId}
                            className="res-orders-item"
                        >

                            <span className="res-orders-item-name">
                                {item.name}
                            </span>

                            <span className="res-orders-item-qty">
                                × {item.quantity}
                            </span>

                            <span className="res-orders-item-price">
                                ₹{item.price * item.quantity}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

            <div className="res-orders-right">

                <div className="res-orders-amount">
                    ₹{order.totalAmount}
                </div>

                <div className="res-orders-time">

                    {new Date(order.createdAt)
                        .toLocaleDateString()}

                    <br />

                    {formatTime(order.createdAt)}

                </div>

                <div className="res-orders-zone">
                    {order.deliveryZone.name}
                </div>

                <span
                    className={`res-orders-status ${order.deliveryStatus === "delivered"
                            ? "res-orders-status-delivered"
                            : "res-orders-status-cancelled"
                        }`}
                >
                    {order.deliveryStatus}
                </span>

            </div>

        </div>
    )
}

export default OrderHistoryCard;