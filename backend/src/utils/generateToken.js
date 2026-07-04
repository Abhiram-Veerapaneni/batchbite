import jwt from "jsonwebtoken";

const generateToken = (res, accountId, accountType) => {

    const token = jwt.sign(
        {
            accountId,
            accountType
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction ,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

};

export default generateToken;