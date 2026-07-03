import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getZones = async () => {

    try {
        
        const res = await axios.get(`${API_URL}/zones`)

        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getSlots = async () => {

    try {
        const res = await axios.get(`${API_URL}/slots`)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getRestaurantLedgers = async () => {

    try {

        const res = await axios.get(
            `${API_URL}/payments/ledgers`,
            {
                withCredentials: true
            }
        );

        return res.data;

    } catch (error) {

        console.log(error.message);

        throw error.response?.data || error;

    }

};

export const settleRestaurantLedger = async (ledgerId) => {

    try {

        const res = await axios.patch(
            `${API_URL}/payments/settle/${ledgerId}`,
            {},
            {
                withCredentials: true
            }
        );

        return res.data;

    } catch (error) {

        console.log(error.message);

        throw error.response?.data || error;

    }

};