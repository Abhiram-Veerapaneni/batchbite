import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllBatches = async () => {

    const response = await axios.get(
        `${API_URL}/batches`,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const assignBatch = async (batchId, agentId) => {

    const response = await axios.patch(

        `${API_URL}/batches/${batchId}/assign`,

        { agentId },

        { withCredentials: true }
    );

    return response.data;
};