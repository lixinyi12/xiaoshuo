import { jwtDecode } from 'jwt-decode';

export function decodeToken(token) {
    if(!token){
        return{
            uid: null,
            phone: null,
            email: null
        }
    }
    try {
        const decoded = jwtDecode(token);
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