import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/AdminLogin.module.css";
import { useAdminAuth } from "../context/useAdminAuth";

export default function AdminLogin() {
    const [username, setUsername] = useState("admin@dexoresport.com");
    const [password, setPassword] = useState("dexoradmin123");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { loginAdmin } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                loginAdmin(data.token, data.admin);
                navigate("/admin");
            } else {
                setError(data.message || "Invalid master credentials. Access denied.");
            }
        } catch {
            setError("Failed to connect to backend server. Ensure backend is running on port 3000.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.loginCard}>
                <div className={styles.brandHeader}>
                    <img 
                        src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" 
                        alt="Dexor Logo" 
                        className={styles.brandLogo} 
                    />
                    <div className={styles.brandTitle}>
                        <h1>Dexor<span>Esport</span></h1>
                        <span className={styles.masterTag}>Master Command Hub</span>
                    </div>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form className={styles.loginForm} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label>Administrator Username or Email</label>
                        <input 
                            type="text" 
                            className={styles.inputField} 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="admin@dexoresport.com"
                            required 
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Master Security Key</label>
                        <input 
                            type="password" 
                            className={styles.inputField} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••••••"
                            required 
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? "AUTHENTICATING..." : "ACCESS MASTER CONSOLE"}
                    </button>
                </form>

                <div className={styles.defaultCredentialsBox}>
                    <p>Pre-configured Master Credentials:</p>
                    <div>Username: <span>admin@dexoresport.com</span></div>
                    <div>Password: <span>dexoradmin123</span></div>
                </div>
            </div>
        </div>
    );
}
