import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const CartContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([]);
    // const [restaurantId, setRestaurantId] = useState(null); 

    const [restaurantZone, setRestaurantZone] = useState(null);

    const fetchCart = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/cart`,
                {
                    withCredentials: true
                }
            );
            
            setCart(res.data.items || []);
            setRestaurantZone(res.data.restaurantZone || null);
            
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (item) => {

        try {

            await axios.post(
                `${API_URL}/cart/add`,
                {
                    item
                },
                {
                    withCredentials: true
                }
            );

            await fetchCart();

            toast.success(
                `${item.name} added to cart`
            );

        } catch (error) {

            console.error(
                error.response?.data?.message ||
                "Failed to add item"
            );
            toast.error(
                error.response?.data?.message ||
                "Failed to add item"
            );

        }

    };

    const increaseQuantity = async (itemId) => {

        try {
            
            await axios.patch(
                `${API_URL}/cart/increase/${itemId}`,
                {},
                {
                    withCredentials: true
                }
            );

            await fetchCart();

        } catch (error) {
            console.log(error);
        }

    };

    const decreaseQuantity = async (itemId) => {

        try {

            await axios.patch(
                `${API_URL}/cart/decrease/${itemId}`,
                {},
                {
                    withCredentials: true
                }
            );

            await fetchCart();

        } catch (error) {
            console.log(error);
        }

    };

    const clearCart = async () => {

        try {

            await axios.delete(
                `${API_URL}/cart`,
                {
                    withCredentials: true
                }
            );

            setCart([]);
            setRestaurantZone(null);

        } catch (error) {
            console.log(error);
        }

    };

    return (

        <CartContext.Provider
            value={{
                cart,
                restaurantZone,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                fetchCart
            }}
        >

            {children}

        </CartContext.Provider>

    );

};