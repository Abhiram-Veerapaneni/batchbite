import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Cart from "../models/Cart.js";

// for new Registration

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            confirmPassword,
            university,
            role,
            address
        } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            university,
            address
        });

        // Create cart for user
        await Cart.create({
            user: user._id,
            items: [],
            restaurantZone: null
        });

        // generate JWT cookie
        generateToken(res, user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            university: user.university,
            address: user.address
        });

    } catch (error) {
        console.error("REGISTER ERROR");

        res.status(500).json({
            message: error.message
        });
    }
};

// Login user
const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        // select password explicitly because 
        // by default it doesn't give password field

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare
        const isPasswordCorrect = await user.matchPassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // prevent login for disabled users
        if (!user.isActive) {
            return res.status(403).json({
                message: "Account has been disabled"
            });
        }

        // generate jwt cookie
        generateToken(res, user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            university: user.university
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// Logout
const logoutUser = async (req, res) => {

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
};

// if user already logged-in (jwt session)
const getCurrentUser = async (req, res) => {
    res.status(200).json(req.user);
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
}