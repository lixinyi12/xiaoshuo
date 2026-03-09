const jwt = require('jsonwebtoken');
const secretKey = require('../constants/secretKey.js');

function decodeToken(token) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            throw new Error('Invalid token');
        }
        return {
            uid: decoded.uid,
            phone: decoded.phone,
            email: decoded.email,
            roles: decoded.roles,
            permissions: decoded.permissions
        };
    } catch (error) {
        throw new Error('Token decode failed');
    }
}

function createToken(uid, phone, email, roles = [], permissions = []) {
    const token = jwt.sign(
        {
            uid,
            phone,
            email,
            roles,
            permissions
        },
        secretKey.secretKey,
        {
            expiresIn: '24h'
        }
    );
    return token;
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey.secretKey);
    } catch (e) {
        return null;
    }
};

module.exports = {
    decodeToken,
    createToken,
    verifyToken
};