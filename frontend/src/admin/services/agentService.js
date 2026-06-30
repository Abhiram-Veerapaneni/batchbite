import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAvailableAgents = async () => {

    const response = await axios.get(
        `${API_URL}/agents`,
        {
            withCredentials: true
        }
    );

    return response.data.filter(
        agent => agent.status === "available"
    );
};

export const getAllAgents = async () => {

    const response = await axios.get(
        `${API_URL}/agents`,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const createAgent = async (data) => {

    const res = await axios.post(
        `${API_URL}/agent/register`,
        data,
        {
            withCredentials: true
        }
    )

    console.log("Agent created")
}

export const updateAgent = async(agentId, data) => {
    
    try {
        
        const res = await axios.patch(
            `${API_URL}/agents/${agentId}`,
            data,
            {
                withCredentials: true
            }
        )

        console.log("Updated Agent")
    } catch (error) {
        console.log(error);
    }
}

export const deleteAgent = async(agentId) => {

    try {
        
        const res = await axios.delete(
            `${API_URL}/agents/${agentId}`,
            {
                withCredentials: true
            }
        )
        console.log("Agent deleted")
    } catch (error) {
        
        console.log(error)
    }
}