import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import FoodCard from "../components/FoodCard";

const API_URL = import.meta.env.VITE_API_URL;

function OrderHistory() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const res = await axios.get(
                    `${API_URL}/orders/my-orders`,
                    {
                        withCredentials: true
                    }
                );

                setOrders(res.data);
                setLoading(false);

            } catch (error) {

                console.log(error);

            }

        };

        fetchOrders();

    }, []);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-icon">
                    🍽️
                </div>

                <h2>Loading Orders...</h2>
            </div>
        );
    }

    // empty state
    if (orders.length === 0) {
        return (
            <div className="empty-orders">

                <div className="empty-orders-icon">
                    📦
                </div>

                <h2>No orders yet</h2>

                <p>
                    Order something delicious!
                </p>

                <Link
                    to="/dashboard"
                    className="explore-food-btn"
                >
                    Explore Food
                </Link>

            </div>
        );
    }
    return (

        <div className="order-history-page">

            <h1>Order History</h1>

            {

                orders.map((order) => (

                    <div
                        key={order._id}
                        className="order-card"
                    >
                        <div className="order-header">

                            <div>
                                <h2 className="order-restaurant-name">
                                    {order.restaurant.name}
                                </h2>

                                <p className="order-meta">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                    {" • "}
                                    {order.slot.startTime}
                                    {" - "}
                                    {order.slot.endTime}
                                    {" • "}
                                    {order.paymentMethod.toUpperCase()}
                                </p>
                            </div>

                            <span
                                className={`status-chip ${order.status}`}
                            >
                                {order.status}
                            </span>

                        </div>

                        <div className="order-items">

                            {order.items.map((item) => (

                                <FoodCard
                                    key={`${order._id}-${item.itemId}`}
                                    item={{
                                        ...item,
                                        restaurantName: order.restaurant.name
                                    }}
                                    layout="horizontal"

                                    showRestaurant={false}
                                    showVegChip={true}

                                    showStatus={false}
                                />

                            ))}

                        </div>

                        <div className="payment-details">

                            <div className="payment-row">
                                <span>Payment Status</span>

                                <strong>
                                    {order.paymentStatus}
                                </strong>
                            </div>

                            <div className="payment-row">
                                <span>Total Amount</span>

                                <strong>
                                    ₹{order.totalAmount}
                                </strong>
                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default OrderHistory;