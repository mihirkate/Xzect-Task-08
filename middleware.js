const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Authorization header missing or invalid format" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            role: decoded.role // Attach role to req.user
        };
        console.log("Decoded token:", decoded); // Add this line
        next();
    } catch (err) {
        console.error("Token verification error:", err); // Add this line
        return res.status(403).json({ message: "Invalid token" });
    }
};

const checkRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
module.exports = {
    authMiddleware, checkRoles
}