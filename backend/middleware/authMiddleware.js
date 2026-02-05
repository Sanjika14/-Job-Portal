const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'supersecret_jobportal_123!');

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            return next();
        } catch (error) {
            console.error('JWT Verification Error [V2]:', error.message);
            return res.status(401).json({ message: `AUTH_ERROR_V2: ${error.message}` });
        }

    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user ? req.user.role : 'unauthorized'} is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
