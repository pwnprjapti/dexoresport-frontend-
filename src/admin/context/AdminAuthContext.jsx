import { useState, useEffect } from "react";
import { AdminAuthContext } from "./AdminContextCore";

export const AdminAuthProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState(() => localStorage.getItem("dexor_admin_token") || null);
    const [adminUser, setAdminUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("dexor_admin_user")) || null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const loginAdmin = (token, user) => {
        localStorage.setItem("dexor_admin_token", token);
        localStorage.setItem("dexor_admin_user", JSON.stringify(user));
        setAdminToken(token);
        setAdminUser(user);
    };

    const logoutAdmin = () => {
        localStorage.removeItem("dexor_admin_token");
        localStorage.removeItem("dexor_admin_user");
        setAdminToken(null);
        setAdminUser(null);
    };

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem("dexor_admin_token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) {
                    logoutAdmin();
                } else {
                    const data = await res.json();
                    if (data.admin) setAdminUser(data.admin);
                }
            } catch {
                // Retain local state on network error
            } finally {
                setLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    return (
        <AdminAuthContext.Provider value={{ adminToken, adminUser, loginAdmin, logoutAdmin, loading, isAuthenticated: !!adminToken }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export default AdminAuthProvider;
