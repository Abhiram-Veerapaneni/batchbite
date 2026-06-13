import jwt from "jsonwebtoken";

const generateToken =  (res, userId, role) => {

    const token = jwt.sign(
        {
            userId,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.cookie("jwt", token, {
        httpOnly: true, // js cannot access cookie
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
    });

};

export default generateToken;