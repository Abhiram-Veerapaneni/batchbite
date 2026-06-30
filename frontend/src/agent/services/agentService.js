import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCurrentBatch = async () => {
    const { data } = await axios.get(
        `${API_URL}/agent/current-batch`,
        { withCredentials: true }
    );

    return data;
};

export const pickUpBatch = async (batchId) => {
    const { data } = await axios.patch(
        `${API_URL}/agent/batches/${batchId}/pick-up`,
        {},
        { withCredentials: true }
    );

    return data;
};

export const deliverBatch = async (batchId) => {
    const { data } = await axios.patch(
        `${API_URL}/agent/batches/${batchId}/deliver`,
        {},
        { withCredentials: true }
    );

    return data;
};

export const loginAgent = async (agentData) => {

    const response = await axios.post(
        `${API_URL}/agent/login`,
        agentData,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const logoutAgent = async () => {

    const response = await axios.post(
        `${API_URL}/agent/logout`,
        {},
        {
            withCredentials: true
        }
    );

    return response.data;
}

// get currently logged-in agent
export const getCurrentAgent = async () => {

    const response = await axios.get(
        `${API_URL}/agent/me`,
        {
            withCredentials: true
        }
    );

    return response.data;
}

export const getDeliveryHistory = async () => {

    try {
        const response = await axios.get(
            `${API_URL}/agent/delivery-history`,
            {
                withCredentials: true
            }
        );
        return (response.data);

    } catch (error) {
        console.log(error)
    }

    return response.data;
}