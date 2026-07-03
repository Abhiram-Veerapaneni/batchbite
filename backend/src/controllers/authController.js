import generateToken from "../utils/generateToken.js";

import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Restaurant from "../models/Restaurant.js";
import Agent from "../models/Agent.js";

// for new Registration

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            confirmPassword,
            university,
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
            university,
            address
        });

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

const registerRestaurant = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
            confirmPassword,
            zone
        } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });

        if (existingRestaurant) {

            return res.status(400).json({
                message: "Restaurant already exists"
            })
        }

        const restaurant = await Restaurant.create({
            name,
            email,
            phone,
            password,
            zone
        })

        generateToken(res, restaurant._id, "restaurant");

        res.status(200).json({
            name: restaurant.name,
            email: restaurant.email,
            phone: restaurant.phone,
            zone: restaurant.zone
        })

    } catch (error) {
        console.error("ERROR while registering Restaurant");

        res.status(500).json({
            message: error.message
        });
    }
}


const registerAgent = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            zones
        } = req.body;

        const existingAgent = await Agent.findOne({ email });

        if (existingAgent) {
            return res.status(400).json({
                message: "Agent already exists"
            });
        }

        const agent = await Agent.create({
            name,
            email,
            password,
            phone,
            zones
        });

        res.status(201).json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            phone: agent.phone,
            zones: agent.zones,
            status: agent.status
        });

    } catch (error) {

        console.error("REGISTER AGENT ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }

};


// Login API for all roles
const loginAccount = async (req, res) => {

    try {

        const {
            email,
            password,
            accountType
        } = req.body;

        // select password explicitly because 
        // by default it doesn't give password field

        let account = null

        if (accountType === "student" || accountType === "admin")
            account = await User.findOne({ email }).select("+password");

        if (accountType === "restaurant")
            account = await Restaurant.findOne({ email }).select("+password");

        if (accountType === "agent")
            account = await Agent.findOne({ email }).select("+password");


        if (!account) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare
        const isPasswordCorrect = await account.matchPassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // prevent login for disabled users
        if (accountType === "student" && !account.isActive) {
            return res.status(403).json({
                message: "Account has been disabled"
            });
        }

        // generate jwt cookie
        generateToken(res, account._id, accountType);

        res.status(201).json({
            _id: account._id,
            name: account.name,
            email: account.email,
            accountType
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// Logout
const logoutAccount = async (req, res) => {

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
};

// if user already logged-in (jwt session)
const getCurrentAccount = async (req, res) => {
    res.status(200).json({
        account: req.account,
        accountType: req.accountType
    });
};

export {
    registerUser,
    registerRestaurant,
    registerAgent,
    loginAccount,
    logoutAccount,
    getCurrentAccount
}