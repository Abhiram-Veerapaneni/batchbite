// All authentication API calls will be placed here

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {

    const response = await axios.post(
        `${API_URL}/auth/student/register`,
        userData,
        {
            withCredentials: true // for sending and receiving cookies
        }
    );

    return response.data;
};

export const registerRestaurant = async (data) => {

    try {
        
        const res = await axios.post(
            `${API_URL}/auth/restaurant/register`,
            data,
            {
                withCredentials: true
            }
        )

        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const loginAccount = async (userData) => {

    console.log(userData);

    const response = await axios.post(
        `${API_URL}/auth/login`,
        userData,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const logoutAccount = async () => {

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
export const getCurrentAccount = async () => {

    const response = await axios.get(
        `${API_URL}/auth/me`,
        {
            withCredentials: true
        }
    );

    return response.data;
}