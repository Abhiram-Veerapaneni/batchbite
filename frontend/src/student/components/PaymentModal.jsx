import { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PaymentModal = ({
    isOpen,
    onClose,
    orderData,
    user
}) => {

    const {clearCart } = useContext(CartContext);

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setLoading(true);

        try {
            // 1. Load Razorpay script
            const res = await loadRazorpayScript();

            if (!res) {
                alert("Razorpay SDK failed to load");
                return;
            }

            // 2. Create Razorpay order from backend
            const { data } = await axios.post(
                `${API_URL}/payments/create-order`,
                orderData,
                {
                    withCredentials: true
                }
            );

            const { order, key } = data;

            // 3. Open Razorpay checkout
            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: "BatchBite",
                description: "Food Order Payment",
                order_id: order.id,

                handler: async function (response) {
                    try {
                        // 4. Verify payment
                        const verifyRes = await axios.post(
                            `${API_URL}/payments/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,

                                orderData
                            },
                            {
                                withCredentials: true
                            }
                        );

                        alert("Payment successful!");
                        clearCart();
                        onClose();

                        // redirect or refresh
                        window.location.href = "/order-history";

                    } catch (err) {
                        console.log(err);
                        alert("Payment verification failed");
                    }
                },

                prefill: {
                    name: user?.name,
                    email: user?.email
                },

                theme: {
                    color: "#3399cc"
                }
            };

            const razor = new window.Razorpay(options);
            razor.open();

        } catch (error) {
            console.log(error);
            alert("Payment failed");
        }

        setLoading(false);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                <h2>Confirm Payment</h2>

                <p>Total Amount: ₹{orderData.totalAmount}</p>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={styles.payBtn}
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>

                <button onClick={onClose} style={styles.closeBtn}>
                    Cancel
                </button>

            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    modal: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "300px",
        textAlign: "center"
    },
    payBtn: {
        background: "green",
        color: "white",
        padding: "10px",
        marginTop: "10px",
        width: "100%",
        border: "none",
        cursor: "pointer"
    },
    closeBtn: {
        marginTop: "10px",
        background: "red",
        color: "white",
        padding: "10px",
        width: "100%",
        border: "none",
        cursor: "pointer"
    }
};

export default PaymentModal;