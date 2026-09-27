import { useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "../css/AdminLayout.module.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAdminAuth } from "../context/useAdminAuth";

export default function AdminLayout({ children, onRefresh }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated, loading } = useAdminAuth();

    if (loading) {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#07090e",
                color: "#00f0ff",
                fontFamily: "Orbitron, sans-serif"
            }}>
                VERIFYING MASTER ADMIN CREDENTIALS...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className={styles.adminWrapper}>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && <div className={styles.sidebarBackdrop} onClick={() => setSidebarOpen(false)}></div>}
            <div className={styles.mainContainer}>
                <AdminHeader 
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                    onRefresh={onRefresh} 
                />
                <main className={styles.contentBody}>
                    {children}
                </main>
            </div>
        </div>
    );
}
