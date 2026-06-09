import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// for new Registration

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            university,
            role,
            confirmPassword
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
            university
        });

        // generate JWT cookie
        generateToken(res, user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            university: user.university
        });

    } catch (error) {
        console.error("REGISTER ERROR:");
        console.error(error);

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

    // expire the cookie
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
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