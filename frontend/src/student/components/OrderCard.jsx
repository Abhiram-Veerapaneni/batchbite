import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatTime } from "../../utils/timeUtils";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function OrderCard({ order, batchInfos , slots, refreshOrders}) {

    const navigate = useNavigate();

    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");

    const [confirmingCancel, setConfirmingCancel] = useState(null);

    const canModifyOrder = (order) => {
        return (
            !["delivered", "out_for_delivery", "cancelled"].includes(order.deliveryStatus) &&
            order.batchStatus !== "batched" &&
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

            toast.success("Slot changed successfully");
            refreshOrders();
            setEditingOrder(null);

        } catch (error) {
            toast.error(error.response?.data?.message ||"Failed to update slot");
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

            toast.success("Order cancelled successfully and refund is requested");

            await axios.post(
                `${API_URL}/payments/refund`,
                { orderId: orderId },
                {
                    withCredentials: true
                }
            )

            refreshOrders();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to cancel order"
            );
        }
    }

    return (

        <div className="oh-card">

            {/* Header */}

            <div className="oh-header">

                <div className="oh-header-left">

                    <div className="oh-top">

                        <h2 className="oh-total"> ₹{order.totalAmount} </h2>

                        <span className={`oh-delivery-status oh-${order.deliveryStatus}`} >
                            {order.deliveryStatus.replaceAll("_", " ")}
                        </span>

                    </div>

                    <h3 className="oh-route">

                        {order.restaurantZone.name}

                        <span className="oh-arrow"> → </span>

                        {order.deliveryZone.name}

                    </h3>

                    <p className="oh-meta">

                        {new Date(order.createdAt).toLocaleDateString()}

                        {" • "}
                        {formatTime(order.slot.startTime)}
                        {" - "}
                        {formatTime(order.slot.endTime)}

                    </p>

                </div>

            </div>

            {/* Items */}

            <div className="oh-items">

                <div className="oh-items-header">

                    <span> Your Order </span>

                    <span className="oh-item-count">

                        {order.items.length} {" "} Item{order.items.length > 1 ? "s" : ""}

                    </span>

                </div>

                {order.items.map((item) => (

                    <div
                        key={`${order._id}-${item.itemId}`}
                        className="oh-item"
                        onClick={() =>
                            navigate(`/food/${item.itemId}`)
                        }
                    >

                        <div className="oh-item-left">

                            <span
                                className={`oh-veg-dot ${item.isVeg
                                    ? "oh-veg"
                                    : "oh-nonveg"
                                    }`}
                            />

                            <span className="oh-item-name">

                                {item.name}

                                <span className="oh-item-qty">

                                    ×{item.quantity}

                                </span>

                            </span>

                        </div>

                        <div className="oh-item-right">

                            <span className="oh-item-price">

                                ₹{item.price * item.quantity}

                            </span>

                            <span className="oh-item-arrow">
                                ›
                            </span>

                        </div>

                    </div>

                ))}

            </div>

            {/* Footer */}

            <div className="oh-footer">

                <div
                    className={`oh-chip oh-${order.batchStatus}`}
                >
                    Batch&nbsp;
                    {order.batchStatus.replaceAll("_", " ")}
                </div>

                <div
                    className={`oh-chip oh-${order.deliveryStatus}`}
                >
                    Delivery&nbsp;
                    {order.deliveryStatus.replaceAll("_", " ")}
                </div>

                <div
                    className={`oh-chip oh-${order.paymentStatus}`}
                >
                    Payment&nbsp;
                    {order.paymentStatus}
                </div>

                {(order.batchStatus === "pending" ||
                    order.batchStatus === "shifted") && (

                        <div className="oh-chip oh-batch-count">

                            👥 {" "}
                            {batchInfos[order._id]?.totalOrders ?? 0} / {batchInfos[order._id]?.threshold ?? 0}

                        </div>

                    )}

                {order.shiftCount > 0 && (

                    <div className="oh-chip oh-shift">

                        ↻ {" "} Shifted {" "} {order.shiftCount}

                    </div>

                )}

            </div>

            {/* Actions */}

            {canModifyOrder(order) && (

                <div className="oh-actions">

                    {editingOrder === order._id ? (

                        <div className="oh-slot-editor">

                            <div className="oh-slot-header">

                                <h4>
                                    Change Delivery Slot
                                </h4>

                                <button
                                    className="oh-close-btn"
                                    onClick={() => {
                                        setEditingOrder(null);
                                        setSelectedSlot("");
                                    }}
                                >
                                    ✕
                                </button>

                            </div>

                            <select
                                className="oh-slot-select"
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(e.target.value) }
                            >

                                {slots.map(slot => (

                                    <option key={slot._id} value={slot._id} >

                                        {formatTime(slot.startTime)}
                                        {" - "}
                                        {formatTime(slot.endTime)}

                                    </option>

                                ))}

                            </select>

                            <button
                                className="oh-save-btn"
                                onClick={() => modifySlot(order._id, selectedSlot) }
                            >
                                Save Changes
                            </button>

                        </div>

                    ) : (

                        <div className="oh-action-buttons">

                            {confirmingCancel === order._id ? (

                                <>
                                    <button
                                        className="oh-confirm-btn"
                                        onClick={() =>
                                            cancelOrder(order._id)
                                        }
                                    >
                                        Confirm Cancellation
                                    </button>

                                    <button
                                        className="oh-back-btn"
                                        onClick={() =>
                                            setConfirmingCancel(null)
                                        }
                                    >
                                        Back
                                    </button>

                                </>
                            ) : (
                                <>
                                    <button
                                        className="oh-modify-btn"
                                        onClick={() => {
                                            setEditingOrder(order._id);
                                            setSelectedSlot( order.slot._id );
                                        }}
                                    >
                                        Modify Slot
                                    </button>

                                    <button
                                        className="oh-cancel-btn"
                                        onClick={() => setConfirmingCancel(order._id) }
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
    )
}

export default OrderCard;
