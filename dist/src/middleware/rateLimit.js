const buckets = new Map();
export function createRateLimit(options) {
    return (req, res, next) => {
        const now = Date.now();
        const key = options.keyGenerator?.(req) ?? req.ip ?? "unknown";
        const bucket = buckets.get(key);
        if (!bucket || bucket.resetAt <= now) {
            buckets.set(key, {
                count: 1,
                resetAt: now + options.windowMs,
            });
            next();
            return;
        }
        bucket.count += 1;
        if (bucket.count > options.max) {
            res.status(429).json({
                success: false,
                message: options.message,
            });
            return;
        }
        next();
    };
}
export const authRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many authentication attempts. Please try again later.",
});
export const passwordChangeRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Too many password change attempts. Please try again later.",
});
export const publicSubmissionRateLimit = createRateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many requests. Please try again later.",
});
export const adminMutationRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: "Too many administrative actions. Please try again later.",
});
