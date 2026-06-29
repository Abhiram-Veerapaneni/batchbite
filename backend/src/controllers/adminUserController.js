import User from "../models/User.js";

export const getAllUsers = async (req, res) => {

    try {

        const users = await User.find(
            {
                role : "student"
            }
        )
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch users"
        });

    }

};