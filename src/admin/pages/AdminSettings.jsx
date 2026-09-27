import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../compo/AdminLayout";
import styles from "../css/AdminTables.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdSecurity, 
  MdDns, 
  MdMemory, 
  MdSchedule, 
  MdCheckCircle,
  MdLock
} from "react-icons/md";

export default function AdminSettings() {
    const { adminToken, adminUser } = useAdminAuth();
    const [systemInfo, setSystemInfo] = useState(null);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passMsg, setPassMsg] = useState({ text: "", isError: false });
    const [submitting, setSubmitting] = useState(false);

    const fetchSystemStats = useCallback(async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (data.success && data.stats?.systemInfo) {
                setSystemInfo(data.stats.systemInfo);
            }
        } catch (err) {
            console.error("Error loading system info:", err);
        }
    }, [adminToken]);

    useEffect(() => {
        fetchSystemStats();
    }, [fetchSystemStats]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPassMsg({ text: "", isError: false });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPassMsg({ text: "New password and confirmation do not match.", isError: true });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPassMsg({ text: "Password must be at least 6 characters long.", isError: true });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setPassMsg({ text: "Master Admin password successfully changed!", isError: false });
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setPassMsg({ text: data.message || "Failed to change password", isError: true });
            }
        } catch {
            setPassMsg({ text: "Error communicating with server", isError: true });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout onRefresh={fetchSystemStats}>
            <div className={styles.pageContainer}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderLeft}>
                        <h1>System Health & <span>Master Security</span></h1>
                        <p>Real-time infrastructure health metrics, server environment details, and master security keys.</p>
                    </div>
                </div>

                {/* System Infrastructure Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                    <div style={{ background: "rgba(15, 20, 34, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "20px", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#00ff88", marginBottom: "8px" }}>
                            <MdDns style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}>Database</span>
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                            {systemInfo?.dbStatus || "Connected"}
                        </div>
                        <small style={{ color: "#64748b" }}>MongoDB Atlas Replica Cluster</small>
                    </div>

                    <div style={{ background: "rgba(15, 20, 34, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "20px", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#00f0ff", marginBottom: "8px" }}>
                            <MdSchedule style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}>Server Uptime</span>
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                            {systemInfo?.uptime || 0} seconds
                        </div>
                        <small style={{ color: "#64748b" }}>Express backend live</small>
                    </div>

                    <div style={{ background: "rgba(15, 20, 34, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "20px", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#8a2be2", marginBottom: "8px" }}>
                            <MdMemory style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}>Memory Heap</span>
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                            {systemInfo?.memoryUsage || "N/A"}
                        </div>
                        <small style={{ color: "#64748b" }}>Node.js process usage</small>
                    </div>

                    <div style={{ background: "rgba(15, 20, 34, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "20px", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ffaa00", marginBottom: "8px" }}>
                            <MdCheckCircle style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}>Environment</span>
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                            {systemInfo?.nodeVersion ? `Node ${systemInfo.nodeVersion}` : "Node.js Server"}
                        </div>
                        <small style={{ color: "#64748b" }}>OS: {systemInfo?.platform || "win32"}</small>
                    </div>
                </div>

                {/* Security Card: Change Admin Password */}
                <div style={{ background: "rgba(15, 20, 34, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "28px", maxWidth: "600px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                            <MdSecurity />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: "#fff", fontFamily: "Orbitron, sans-serif", fontSize: "16px" }}>
                                Master Security Keys
                            </h3>
                            <small style={{ color: "#64748b" }}>Account: {adminUser?.email || "admin@dexoresport.com"}</small>
                        </div>
                    </div>

                    {passMsg.text && (
                        <div style={{
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "16px",
                            fontSize: "13px",
                            background: passMsg.isError ? "rgba(255, 51, 102, 0.15)" : "rgba(0, 255, 136, 0.15)",
                            border: `1px solid ${passMsg.isError ? "#ff3366" : "#00ff88"}`,
                            color: passMsg.isError ? "#ff3366" : "#00ff88"
                        }}>
                            {passMsg.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div className={styles.formGroup}>
                            <label>Current Master Password</label>
                            <input 
                                type="password" 
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                placeholder="••••••••••••"
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>New Master Password (Min 6 Characters)</label>
                            <input 
                                type="password" 
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="••••••••••••"
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="••••••••••••"
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.headerActionBtn} 
                            style={{ alignSelf: "flex-start", marginTop: "8px" }}
                            disabled={submitting}
                        >
                            <MdLock /> {submitting ? "Updating Password..." : "Update Master Key"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
