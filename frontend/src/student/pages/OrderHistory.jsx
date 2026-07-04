import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import OrderCard from "../components/OrderCard";

const API_URL = import.meta.env.VITE_API_URL;

function OrderHistory() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState([]);
    const [batchInfos, setBatchInfos] = useState({});

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshOrders = () => {
        setRefreshKey(prev => prev + 1);
    };

    const fetchBatchInfos = async (ordersList) => {

        try {

            const eligibleOrders = ordersList.filter(
                order =>
                    order.batchStatus === "pending" ||
                    order.batchStatus === "shifted"
            );

            const responses = await Promise.all(

                eligibleOrders.map(order =>
                    axios.get(
                        `${API_URL}/batch-groups/current/${order.slot._id}/${order.deliveryZone._id}/${order.restaurantZone._id}`,
                        {
                            withCredentials: true
                        }
                    )
                )

            );

            const batchData = {};

            responses.forEach((res, index) => {
                batchData[eligibleOrders[index]._id] = res.data;
            });

            setBatchInfos(batchData);
            console.log(batchData);

        } catch (error) {
            console.log(error);
        }

    };

    const fetchOrders = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/orders/my-orders`,
                {
                    withCredentials: true
                }
            );

            setOrders(res.data);
            await fetchBatchInfos(res.data);
            setLoading(false);

        } catch (error) {
            console.log(error);
        }

    };

    const fetchSlots = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/slots`
            );

            setSlots(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchSlots();
    }, [refreshKey]);

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
                    <OrderCard
                        key={order._id}
                        order={order}
                        batchInfos={batchInfos}
                        slots={slots}
                        refreshOrders={refreshOrders}
                    />
                ))

            }

        </div>

    );

}

export default OrderHistory;