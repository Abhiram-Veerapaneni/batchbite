import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/restaurants`;

export const getTodaysOrders = async () => {

    try {
        
        const res = await axios.get(
            `${API_URL}/orders/today`,
            {
                withCredentials: true
            }
        )

        return res.data;
    } catch (error) {
        
        console.log(error.message);
    }
}

export const getRestaurantOrderHistory = async () => {

    try {
        
        const res = await axios.get(
            `${API_URL}/order-history`,
            {
                withCredentials: true
            }
        )
        return res.data
    } catch (error) {
        console.log(error.message)
    }
}
export const getMenu = async () => {

    try {

        const res = await axios.get(
            `${API_URL}/menu`,
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

export const addMenuItem = async (form) => {

    try {

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("image", form.image);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("isVeg", form.isVeg);

        const res = await axios.post(
            `${API_URL}/menu`,
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

export const updateMenuItem = async (itemId, form) => {

    try {

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("isVeg", form.isVeg);
        formData.append("isAvailable", form.isAvailable);

        if (form.image) {
            formData.append("image", form.image);
        }

        const res = await axios.patch(
            `${API_URL}/menu/${itemId}`,
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

export const deleteMenuItem = async (itemId) => {

    try {

        const res = await axios.delete(
            `${API_URL}/menu/${itemId}`,
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

export const toggleAvailability = async (itemId) => {

    try {

        const res = await axios.patch(
            `${API_URL}/menu/${itemId}/toggle`,
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


export const getRestaurantProfile = async () => {

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

// PATCH /api/restaurants/profile
export const updateRestaurantProfile = async (form) => {

    try {

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("phone", form.phone);

        if (form.image instanceof File) {
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

// PATCH /api/restaurants/change-password
export const changeRestaurantPassword = async (form) => {

    try {

        const res = await axios.patch(
            `${API_URL}/change-password`,
            {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            },
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