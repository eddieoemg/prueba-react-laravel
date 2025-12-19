import { useState } from 'react';
import httpClient from '../utils/httpClient';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { setToken, clearAuth, isAuthenticated,token } = useAuthStore();
    const { setUser, clearUser, user } = useUserStore();
console.log('token,',token);
console.log('user,',user);
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await httpClient.post('auth/login', { email, password });
            const { token, user } = response.data;

            console.log('user',user);
            setToken(token);
            setUser(user);

            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message;
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);

        try {
            await httpClient.post('auth/logout');
        } catch (err) {
        } finally {
            clearAuth();
            clearUser();
            setLoading(false);
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
    };
};