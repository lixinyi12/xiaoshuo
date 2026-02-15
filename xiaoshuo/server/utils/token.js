const jwt = require('jsonwebtoken');
const secretKey = require('../secretKey.js');

function decodeToken(token) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            throw new Error('Invalid token');
        }
        return {
            uid: decoded.uid,
            phone: decoded.phone,
            email: decoded.email
        };
    } catch (error) {
        throw new Error('Token decode failed');
    }
}

function createToken(uid, phone, email) {
    const token = jwt.sign(
        {
            uid,
            phone,
            email
        },
        secretKey.secretKey,
        {
            expiresIn: '24h'
        }
    );
    return token;
}

module.exports = {
    decodeToken,
    createToken
};