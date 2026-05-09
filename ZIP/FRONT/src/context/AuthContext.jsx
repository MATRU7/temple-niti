import { createContext, useState, useEffect } from "react";
import axiosClient from "../../apiClient.js"; // wait, the path might be different

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await axiosClient.get("/users/me");
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await axiosClient.post("/users/login", { email, password });
        setUser(res.data);
        return res.data;
    };

    const logout = async () => {
        await axiosClient.post("/users/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
