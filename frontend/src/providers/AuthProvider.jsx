import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth';

export const AuthProvider = ({ children }) => {
    const [checking, setChecking] = useState(true);
     const { isAuthenticated } = useAuthStore();
    useEffect(() => {
        if (isAuthenticated) {
            setChecking(false);
            return;
        }

    }, []);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span>Cargando...</span>
            </div>
        );
    }

    return children;
};