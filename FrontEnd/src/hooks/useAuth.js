// Custom hook for authentication related features ->
import { useState, useEffect } from 'react';
import { login as loginService } from '../services/authService';
import { AuthContext } from '../utils/authContext';

export function useAuth() {
    const [user, setUser] = useState(null);

    const authContext = useContext(AuthContext);

    const login = async (username, password) => {
        try {
            const userData = await loginService(username, password);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return { user, isAuthenticated, login };
}
