import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCurrentBatch = async () => {
    const { data } = await axios.get(
        `${API_URL}/agents/current-batch`,
        { withCredentials: true }
    );

    return data;
};

export const pickUpBatch = async (batchId) => {
    const { data } = await axios.patch(
        `${API_URL}/batches/${batchId}/pick-up`,
        {},
        { withCredentials: true }
    );

    return data;
};

export const deliverBatch = async (batchId) => {
    const { data } = await axios.patch(
        `${API_URL}/batches/${batchId}/deliver`,
        {},
        { withCredentials: true }
    );

    return data;
};