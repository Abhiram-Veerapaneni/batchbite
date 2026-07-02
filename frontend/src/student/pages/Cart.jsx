import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { CartContext } from "../../context/CartContext";
import FoodCard from "../components/FoodCard";

import { formatTime } from "../../utils/timeUtils";
import PaymentModal from "../components/PaymentModal";
import { AuthContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const DELIVERY_CHARGE = 50;

const Cart = () => {

    const { account } = useContext(AuthContext);
    const {
        cart,
        clearCart,
        restaurantZone,
        increaseQuantity,
        decreaseQuantity
    } = useContext(CartContext);

    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [deliveryZone, setDeliveryZone] = useState("");
    const [zones, setZones] = useState([]);

    const [batchInfo, setBatchInfo] = useState(null);

    const [showPayment, setShowPayment] = useState(false);
    const [orderData, setOrderData] = useState([]);

    const fetchSlots = async () => {
        try {
            const res = await axios.get(`${API_URL}/slots`);
            setSlots(res.data);

            // set first slot
            if (res.data.length > 0) {
                setSelectedSlot(res.data[0]._id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchZones = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/zones`,
                {
                    withCredentials: true
                }
            );
            setZones(res.data);
            setDeliveryZone(res.data[0]._id);

        } catch (err) {
            toast.error(err?.response?.data?.message || "Error in fetching or setting zone");
        }
    }

    useEffect(() => {

        fetchZones();
        fetchSlots();
    }, []);

    useEffect(() => {

        if (!selectedSlot || !deliveryZone || !restaurantZone) {
            setBatchInfo(null);
            return;
        }

        const fetchBatchInfo = async () => {
            try {

                const res = await axios.get(
                    `${API_URL}/batch-groups/current/${selectedSlot}/${deliveryZone}/${restaurantZone._id}`,
                    {
                        withCredentials: true
                    }
                );

                setBatchInfo(res.data);

            } catch (err) {
                console.error(err);
                setBatchInfo({
                    totalOrders: 0,
                    threshold: 0
                });
            }
        };

        fetchBatchInfo();

    }, [selectedSlot, deliveryZone, restaurantZone]);

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const totalAmount = subtotal + DELIVERY_CHARGE;

    const placeOrder = async () => {
        try {
            if (!selectedSlot) {
                toast.error("Please select a delivery slot");
                return;
            }

            if (!restaurantZone) {
                toast.error("Restaurant Zone is missing");
                return;
            }

            if (!deliveryZone) {
                toast.error("Delivery Zone is missing");
                return;
            }

            setShowPayment(true);

            const data = {
                restaurantZone,

                items: cart.map((item) => ({
                    restaurantId: (item.restaurantId),
                    itemId: item.itemId,
                    name: item.name,
                    image: item.image,
                    isVeg: item.isVeg,
                    price: item.price,
                    quantity: item.quantity,
                    restaurantName: item.restaurantName,
                })),

                slot: selectedSlot,

                deliveryZone,
                totalAmount,
                paymentMethod
            };

            setOrderData(data)
            
            // toast.success("Order placed successfully!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to place order"
            );
        }
    };

    // Empty State
    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>

                <h2>Your cart is empty</h2>

                <p>
                    Looks like you haven't added anything yet.
                </p>

                <Link
                    to="/dashboard"
                    className="browse-food-btn"
                >
                    Browse Food
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">

            <div className="cart-header">

                <div>

                    <h1>🛒 Your Cart</h1>

                    <p>
                        {cart.length} item
                        {cart.length > 1 ? "s" : ""}
                        {" "}ready for checkout
                    </p>

                    <div className="zone-badge">
                        🍽 {restaurantZone?.name}
                    </div>

                </div>

            </div>

            <div className="cart-layout">

                {/* LEFT */}

                <div className="cart-items">

                    {cart.map((item) => (

                        <FoodCard
                            key={item.itemId}
                            item={item}
                            layout="horizontal"
                            quantity={item.quantity}
                            showControls={true}
                            showRestaurant={true}
                            showZone={false}
                            showVegChip={true}
                            onIncrease={() =>
                                increaseQuantity(item.itemId)
                            }
                            onDecrease={() =>
                                decreaseQuantity(item.itemId)
                            }
                        />

                    ))}

                    <div className="cart-actions">

                        <Link
                            to="/dashboard"
                            className="secondary-btn"
                        >
                            Continue Browsing
                        </Link>

                        <button
                            className="danger-btn"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="checkout-card">

                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <strong>₹{subtotal}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Delivery Charge</span>
                        <strong>₹{DELIVERY_CHARGE}</strong>
                    </div>

                    <div className="summary-row total-row">
                        <span>Total</span>
                        <strong>₹{totalAmount}</strong>
                    </div>

                    {/* SLOT */}

                    <div className="checkout-section">

                        <h3>Delivery Slot</h3>

                        <select
                            className="modern-select"
                            value={selectedSlot || ""}
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

                    </div>

                    {/* BATCH */}

                    {batchInfo && (() => {

                        const effectiveOrders =
                            (batchInfo.totalOrders || 0) + 1;

                        const progress =
                            Math.min(
                                (
                                    effectiveOrders /
                                    (batchInfo.threshold || 1)
                                ) * 100,
                                100
                            );

                        return (

                            <div className="batch-card">

                                <div className="batch-header">

                                    <span>
                                        🚀 Batch Progress
                                    </span>

                                    <strong>
                                        {
                                            batchInfo.threshold === 0
                                                ? "--"
                                                : `${effectiveOrders}/${batchInfo.threshold}`
                                        }
                                    </strong>

                                </div>

                                <div className="batch-bar">

                                    <div
                                        className="batch-fill"
                                        style={{
                                            width: `${progress}%`
                                        }}
                                    />

                                </div>

                                <div className="batch-text">
                                    {
                                        batchInfo.threshold === 0
                                            ? "No active batch"
                                            : effectiveOrders >= batchInfo.threshold
                                                ? "Batch Ready 🎉"
                                                : `${batchInfo.threshold - effectiveOrders} more orders needed`
                                    }
                                </div>
                            </div>

                        );

                    })()}

                    {/* DELIVERY ZONE */}

                    <div className="checkout-section">

                        <h3>Delivery Zone</h3>

                        <select
                            className="modern-select"
                            value={deliveryZone}
                            onChange={(e) =>
                                setDeliveryZone(e.target.value)
                            }
                        >

                            {zones.map((zone) => (

                                <option
                                    key={zone._id}
                                    value={zone._id}
                                >
                                    {zone.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* PAYMENT */}

                    <div className="checkout-section">

                        <h3>Payment Method</h3>

                        <div className="payment-grid">

                            <div
                                className={`payment-card ${paymentMethod === "cod"
                                    ? "selected"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setPaymentMethod("cod")
                                }
                            >
                                💵
                                <span>Cash</span>
                            </div>

                            <div
                                className={`payment-card ${paymentMethod === "upi"
                                    ? "selected"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setPaymentMethod("upi")
                                }
                            >
                                📱
                                <span>UPI</span>
                            </div>

                        </div>

                    </div>

                    <button
                        className="place-order-btn"
                        onClick={placeOrder}
                    >
                        Place Order • ₹{totalAmount}
                    </button>

                    <PaymentModal
                        isOpen={showPayment}
                        onClose={() => setShowPayment(false)}
                        orderData={orderData}
                        user={account}
                    />

                </div>

            </div>

        </div>
    );
};

export default Cart;