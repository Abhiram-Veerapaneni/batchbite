import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getDeliveryZones = async () => {

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