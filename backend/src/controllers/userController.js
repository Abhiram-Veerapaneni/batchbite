import User from "../models/User.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const getAllUsers = async (req, res) => {

    try {

        const users = await User.find(
            {
                role: "student"
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

export const getUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.account._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user)
        
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });

    }
}

// PATCH /api/users/profile
export const updateUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.account._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {
            name,
            phone,
            university,
            addressLine,
            zone
        } = req.body;

        user.name = name ?? user.name;
        user.phone = phone ?? user.phone;
        user.university = university ?? user.university;

        if (addressLine !== undefined) {
            user.address.addressLine = addressLine;
        }

        if (zone !== undefined) {
            user.address.zone = zone;
        }

        if (req.file) {

            if (user.profileImagePublicId) {

                await cloudinary.uploader.destroy(
                    user.profileImagePublicId
                );

            }

            const result = await uploadToCloudinary(
                req.file.buffer
            );

            user.profileImage = result.secure_url;
            user.profileImagePublicId = result.public_id;

        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};

// PATCH /api/users/change-password
export const changeUserPassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user = await User.findById(
            req.account._id
        ).select("+password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const isMatch = await user.matchPassword(
            currentPassword
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Current password is incorrect"
            });

        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};
