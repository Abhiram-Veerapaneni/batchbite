import Razorpay from "razorpay";

console.log("KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("SECRET EXISTS =", process.env.RAZORPAY_KEY_SECRET);

let razorpayInstance;

const getRazorpayInstance = () => {

    if (!process.env.RAZORPAY_KEY_ID) {
        throw new Error("RAZORPAY_KEY_ID is missing");
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("RAZORPAY_KEY_SECRET is missing");
    }

    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }

    return razorpayInstance;
};

export default getRazorpayInstance;