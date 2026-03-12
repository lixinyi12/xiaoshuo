import { useAuth } from './AuthContext';

export const usePermission = () => {
    const { user } = useAuth();

    const hasRole = (role: any) => {
        return user?.roles?.includes(role) || false;
    };

    const hasPermission = (permission: any) => {
        return user?.permissions?.includes(permission) || false;
    };

    return { user, hasRole, hasPermission };
};