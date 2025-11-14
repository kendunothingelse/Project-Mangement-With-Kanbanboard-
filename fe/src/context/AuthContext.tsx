import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import * as AuthApi from "../api/auth";
import type {User} from "../api/auth";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => {
    },
    register: async () => {
    },
    logout: () => {
    }
});

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(AuthApi.getCurrentUser());
        setLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const u = await AuthApi.login(email, password);
        setUser(u);
    }, []);
    const register = useCallback(async (name: string, email: string, password: string) => {
        const u = await AuthApi.register(name, email, password);
        setUser(u);
    }, []);

    const logout = useCallback(() => {
        AuthApi.logout();
        setUser(null);
    }, []);
    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}