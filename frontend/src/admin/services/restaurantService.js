import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API = `${API_URL}/restaurants`

export const getRestaurants = async () => {
    const res = await axios.get(API, { withCredentials: true });
    return res.data;
};

export const createRestaurant = async (restaurant) => {
    const res = await axios.post(API, restaurant, { withCredentials: true });
    return res.data;
};

export const updateRestaurant = async (id, restaurant) => {
    const res = await axios.patch(`${API}/${id}`, restaurant, { withCredentials: true });
    return res.data;
};

export const deleteRestaurant = async (id) => {
    const res = await axios.delete(`${API}/${id}`, { withCredentials: true });
    return res.data;
};