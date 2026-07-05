export const admin = (req, res, next) => {
    // Authentication middleware must run first
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
        return;
    }
    // Allow only admins
    if (String(req.user.role).toLowerCase() !== "admin") {
        res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges are required.",
        });
        return;
    }
    next();
};
