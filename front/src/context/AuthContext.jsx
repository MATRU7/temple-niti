import { createContext, useState, useEffect } from "react";
import axiosClient from "../../apiClient.js";

export const AuthContext = createContext();

// Helper: extract user from either { user: {...} } or flat response
const extractUser = (data) => data?.user ?? data;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await axiosClient.get("/users/me");
                setUser(extractUser(res.data));
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await axiosClient.post("/users/login", { email, password });
        const userData = extractUser(res.data);
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        try {
            await axiosClient.post("/users/logout");
        } catch { /* ignore */ }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
