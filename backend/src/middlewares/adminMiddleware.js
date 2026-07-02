export const adminMiddleware = (req, res, next) => {

    try {

        if (req.accountType !== "admin") {

            return res.status(403).json({
                message: "Access denied"
            })
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
}