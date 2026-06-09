// All authentication API calls will be placed here

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {

    const response = await axios.post(
        `${API_URL}/auth/register`,
        userData,
        {
            withCredentials: true // for sending and receiving cookies
        }
    );

    return response.data;
};

export const loginUser = async (userData) => {

    const response = await axios.post(
        `${API_URL}/auth/login`,
        userData,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const logoutUser = async () => {

    const response = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
            withCredentials: true
        }
    );

    return response.data;
}

// get currently logged-in user
export const getCurrentUser = async () => {

    const response = await axios.get(
        `${API_URL}/auth/me`,
        {
            withCredentials: true
        }
    );

    return response.data;
}