const jwt = require('jsonwebtoken');
module.exports.authentication = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: "Auth required" });
    token = token.replace('Bearer ', '');
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY || 'abc123')
        if (!decoded) {
            return res.status(403).json({ error: "Auth required" })
        } else {
            req.user = decoded;
            return next()
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" })
    }
}
module.exports.authorization = (userRoleArr) => async (req, res, next) => {
    const { role } = req.user;
    if (!userRoleArr.includes(role)) {
        console.log(role)
        return res.status(403).json({ error: "Auth required" })
    } else {
        return next();
    }
}