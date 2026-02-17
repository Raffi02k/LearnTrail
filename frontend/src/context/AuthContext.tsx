import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { endpoints } from '../lib/api';

interface User {
    id: number;
    email: string;
    name: string;
    roles: string[];
    xp_total?: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginLocal: (username: string, password: string) => Promise<void>;
    loginOidc: () => void; // Triggered via MSAL hook usage usually, but we can wrap
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { instance, accounts } = useMsal();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for local token on mount
    useEffect(() => {
        checkAuth();
    }, [accounts]);

    const checkAuth = async () => {
        const localToken = localStorage.getItem("learntrail_token");
        const authMethod = localStorage.getItem("learntrail_auth_method");

        if (authMethod === "local" && localToken) {
            // Validate local
            try {
                const res = await endpoints.auth.me();
                setUser(res.data);
            } catch (e) {
                console.error("Local token invalid", e);
                logout();
            }
        } else if (accounts.length > 0) {
            // OIDC
            // We need to set the token for API calls
            // Acquire token silently
            try {
                const response = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0]
                });
                // Using idToken for backend identity verification
                localStorage.setItem("learntrail_token", response.idToken);
                localStorage.setItem("learntrail_auth_method", "oidc");

                // Sync user with backend
                const res = await endpoints.auth.me();
                setUser(res.data);
            } catch (e) {
                console.error("OIDC sync failed", e);
                // If interaction required?
            }
        }
        setIsLoading(false);
    };

    const loginLocal = async (username: string, password: string) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const res = await endpoints.auth.login(formData);
        const { access_token, user } = res.data;

        localStorage.setItem("learntrail_token", access_token);
        localStorage.setItem("learntrail_auth_method", "local");
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("learntrail_token");
        localStorage.removeItem("learntrail_auth_method");
        setUser(null);
        if (accounts.length > 0) {
            instance.logoutPopup();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            loginLocal,
            loginOidc: () => instance.loginPopup(loginRequest),
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

// Import needed for loginRequest usage
import { loginRequest } from '../auth/msalConfig';
