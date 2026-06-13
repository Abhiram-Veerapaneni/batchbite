import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { CartContext } from "../context/CartContext";
import FoodCard from "../components/FoodCard";

const API_URL = import.meta.env.VITE_API_URL;
const DELIVERY_CHARGE = 50;

const Cart = () => {
    const {
        cart,
        clearCart,
        restaurantId,
        increaseQuantity,
        decreaseQuantity
    } = useContext(CartContext);

    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const res = await axios.get(`${API_URL}/slots`);
                setSlots(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSlots();
    }, []);

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const totalAmount = subtotal + DELIVERY_CHARGE;

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

    const placeOrder = async () => {
        try {
            if (!selectedSlot) {
                toast.error("Please select a delivery slot");
                return;
            }

            if (!restaurantId) {
                toast.error(
                    "Restaurant information is missing"
                );
                return;
            }

            const orderData = {
                restaurant: restaurantId,

                items: cart.map((item) => ({
                    itemId: item.itemId,
                    name: item.name,
                    image: item.image,
                    isVeg: item.isVeg,
                    price: item.price,
                    quantity: item.quantity
                })),

                slot: selectedSlot,
                totalAmount,
                paymentMethod
            };

            await axios.post(
                `${API_URL}/orders`,
                orderData,
                { withCredentials: true }
            );

            await clearCart();

            toast.success("Order placed successfully!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to place order"
            );
        }
    };

    return (
        <div className="cart-page">
            {/* Header */}

            <div className="cart-header">
                <div>
                    <h1>Your Cart</h1>

                    <p>
                        {cart.length} item
                        {cart.length > 1 ? "s" : ""} ready to
                        checkout
                    </p>
                </div>
            </div>

            {/* Layout */}

            <div className="cart-layout">
                {/* Left Side */}

                <div className="cart-items">
                    {cart.map((item) => (
                        <FoodCard
                            key={item.itemId}
                            item={item}
                            layout="horizontal"
                            quantity={item.quantity}
                            showControls={true}
                            showRestaurant={true}
                            showRegion={false}
                            showVegChip={true}
                            onIncrease={() =>
                                increaseQuantity(item.itemId)
                            }
                            onDecrease={() =>
                                decreaseQuantity(item.itemId)
                            }
                        />
                    ))}

                    <div className="cart-footer">
                        <Link
                            to="/dashboard"
                            className="explore-more-btn"
                        >
                            ← Continue Browsing
                        </Link>
                    </div>
                </div>

                {/* Right Side */}

                <div className="cart-summary">
                    <h2>Checkout</h2>

                    <div className="summary-row">
                        <span>Items</span>
                        <strong>{cart.length}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <strong>₹{subtotal}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Delivery</span>
                        <strong>
                            ₹{DELIVERY_CHARGE}
                        </strong>
                    </div>

                    <div className="summary-row total-row">
                        <span>Total</span>
                        <strong>₹{totalAmount}</strong>
                    </div>

                    {/* Slots */}

                    <div className="slot-section">
                        <h3>Delivery Slot</h3>

                        <div className="slot-buttons">
                            {slots.map((slot) => (
                                <button
                                    key={slot._id}
                                    className={
                                        selectedSlot === slot._id
                                            ? "slot-button selected"
                                            : "slot-button"
                                    }
                                    onClick={() =>
                                        setSelectedSlot(
                                            slot._id
                                        )
                                    }
                                >
                                    {slot.startTime} -{" "}
                                    {slot.endTime}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment */}

                    <div className="payment-section">
                        <h3>Payment Method</h3>

                        <div className="payment-option">
                            <label>
                                <input
                                    type="radio"
                                    value="cod"
                                    checked={
                                        paymentMethod === "cod"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                Cash on Delivery
                            </label>
                        </div>

                        <div className="payment-option">
                            <label>
                                <input
                                    type="radio"
                                    value="upi"
                                    checked={
                                        paymentMethod === "upi"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                UPI
                            </label>
                        </div>
                    </div>

                    <button
                        className="place-order-btn"
                        onClick={placeOrder}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;