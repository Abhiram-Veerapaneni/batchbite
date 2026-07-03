import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

export const getProfile = async () => {

    try {

        const res = await axios.get(
            `${API_URL}/profile`,
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

export const updateProfile = async (form) => {

    try {

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("phone", form.phone);
        formData.append("university", form.university);
        formData.append("addressLine", form.addressLine);
        formData.append("zone", form.zone);

        if (form.image) {
            formData.append("image", form.image);
        }

        const res = await axios.patch(
            `${API_URL}/profile`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return res.data;

    } catch (error) {

        console.log(error.message);
        throw error.response?.data || error;

    }

};

export const changePassword = async (passwords) => {

    try {

        const res = await axios.patch(
            `${API_URL}/change-password`,
            passwords,
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