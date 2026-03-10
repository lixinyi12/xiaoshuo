import { useAuth } from './AuthContext';

export const usePermission = () => {
    const { user } = useAuth();

    const hasRole = (role) => {
        return user?.roles?.includes(role) || false;
    };

    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || false;
    };

    return { user, hasRole, hasPermission };
};