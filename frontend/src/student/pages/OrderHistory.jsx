import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import FoodCard from "../components/FoodCard";

import { formatTime } from "../../utils/timeUtils";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function OrderHistory() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [slots, setSlots] = useState([]);
    const [confirmingCancel, setConfirmingCancel] = useState(null);

    const [batchInfos, setBatchInfos] = useState({});

    const fetchBatchInfos = async (ordersList) => {

        try {

            const eligibleOrders = ordersList.filter(
                order =>
                    order.status === "pending" ||
                    order.status === "shifted"
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
    }, []);


    const canModifyOrder = (order) => {
        return (
            !["delivered", "out_for_delivery", "cancelled"].includes(order.status) &&
            order.canModifyUntil &&
            new Date() < new Date(order.canModifyUntil)
        );
    };

    const modifySlot = async (orderId, slotId) => {
        try {

            await axios.patch(
                `${API_URL}/orders/modify/${orderId}`,
                { slotId },
                { withCredentials: true }
            );

            toast.success(
                "Slot changed successfully"
            );

            setEditingOrder(null);

            await fetchOrders();
            await fetchSlots();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update slot"
            );

        }
    };

    const cancelOrder = async (orderId) => {

        try {
            await axios.patch(
                `${API_URL}/orders/cancel/${orderId}`,
                {},
                {
                    withCredentials: true
                }
            )

            toast.success("Order cancelled successfully");

            await fetchOrders(); // to get updated ones
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to cancel order"
            );
        }
    }

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
                                <div className="batch-route">

                                    <span>
                                        {order.restaurantZone.name}
                                    </span>

                                    <span className="route-arrow">
                                        →
                                    </span>

                                    <span>
                                        {order.deliveryZone.name}
                                    </span>

                                </div>

                                <p className="order-meta">

                                    {formatTime(order.slot.startTime)}
                                    {" - "}
                                    {formatTime(order.slot.endTime)}

                                    {" • "}

                                    {new Date(order.createdAt)
                                        .toLocaleDateString()}

                                    {" • "}

                                    {order.paymentMethod.toUpperCase()}

                                </p>



                                <div className="order-badges">

                                    <div className="order-status-row">

                                        <span
                                            className={`status-chip ${order.status}`}
                                        >
                                            {order.status.replaceAll("_", " ")}
                                        </span>

                                        <span
                                            className={`payment-chip ${order.paymentStatus}`}
                                        >
                                            Payment {order.paymentStatus}
                                        </span>

                                    </div>

                                    {order.shiftCount > 0 && (
                                        <span className="info-chip shift-chip">
                                            ↻ {order.shiftCount}
                                        </span>
                                    )}

                                    {(order.status === "pending" ||
                                        order.status === "shifted") && (

                                            <span className="info-chip batch-chip">
                                                👥 {" "}
                                                {batchInfos[order._id]?.totalOrders ?? 0}
                                                /
                                                {batchInfos[order._id]?.threshold ?? 0}

                                            </span>
                                        )}

                                </div>

                            </div>

                        </div>

                        <div className="order-items-list">

                            {order.items.map((item) => (

                                <div
                                    key={`${order._id}-${item.itemId}`}
                                    className="order-item-row"
                                >

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="order-item-image"
                                    />

                                    <div className="order-item-info">

                                        <h4>{item.name}</h4>

                                        <p className="item-restaurant">
                                            {item.restaurantName}
                                        </p>

                                        <p className="item-price">
                                            ₹{item.price} × {item.quantity}
                                        </p>

                                    </div>

                                    <div
                                        className={
                                            item.isVeg
                                                ? "mini-chip veg-chip"
                                                : "mini-chip nonveg-chip"
                                        }
                                    >
                                        {item.isVeg ? "Veg" : "Non-Veg"}
                                    </div>

                                </div>

                            ))}

                        </div>

                        <div className="order-summary">

                            <span> Total Amount </span>
                            <strong> ₹{order.totalAmount} </strong>

                        </div>

                        {/* order modify section  */}
                        {canModifyOrder(order) && (
                            <div className="order-management">

                                {editingOrder === order._id ? (
                                    <div className="slot-editor">

                                        <div className="slot-editor-header">
                                            <h4>Change Delivery Slot</h4>

                                            <button
                                                className="slot-editor-close"
                                                onClick={() => {
                                                    setEditingOrder(null);
                                                    setSelectedSlot("");
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <select
                                            className="slot-select"
                                            value={selectedSlot}
                                            onChange={(e) =>
                                                setSelectedSlot(e.target.value)
                                            }
                                        >
                                            {slots.map((slot) => (
                                                <option
                                                    key={slot._id}
                                                    value={slot._id}
                                                >
                                                    {formatTime(slot.startTime)}
                                                    {" - "}
                                                    {formatTime(slot.endTime)}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="slot-editor-actions">
                                            <button
                                                className="save-slot-btn"
                                                onClick={() =>
                                                    modifySlot(order._id, selectedSlot)
                                                }
                                            >
                                                Save Changes
                                            </button>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="order-actions">

                                        {confirmingCancel === order._id ? (
                                            <>
                                                <button
                                                    className="confirm-cancel-btn"
                                                    onClick={() => cancelOrder(order._id)}
                                                >
                                                    Confirm Cancellation
                                                </button>

                                                <button
                                                    className="cancel-confirmation-btn"
                                                    onClick={() => setConfirmingCancel(null)}
                                                >
                                                    Back
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="modify-slot-btn"
                                                    onClick={() => {
                                                        setEditingOrder(order._id);
                                                        setSelectedSlot(order.slot._id);
                                                    }}
                                                >
                                                    Modify Slot
                                                </button>

                                                <button
                                                    className="cancel-order-btn"
                                                    onClick={() => setConfirmingCancel(order._id)}
                                                >
                                                    Cancel Order
                                                </button>
                                            </>
                                        )}

                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                ))

            }

        </div>

    );

}

export default OrderHistory;