import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import '../css/login.css';
import Logo from '../compo/Logo.jsx';
import { useTenant } from '../../context/TenantContext.jsx';
import { FaLock, FaShieldAlt, FaRocket, FaGlobe } from 'react-icons/fa';

export default function Login() {
    const navigate = useNavigate();
    const { isTenant, tenantSlug, tenant } = useTenant();

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // If on main domain, direct player login is disabled
    if (!isTenant) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#080c14",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
            }}>
                <div style={{
                    maxWidth: "540px",
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(0, 240, 255, 0.3)",
                    borderRadius: "16px",
                    padding: "36px 30px",
                    textAlign: "center",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)"
                }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "16px",
                        background: "rgba(255, 70, 85, 0.15)",
                        color: "#ff4655",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        margin: "0 auto 16px auto"
                    }}>
                        <FaLock />
                    </div>

                    <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "10px" }}>
                        Player Login Not Available Here
                    </h2>

                    <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                        Player login is only accessible through your tournament organizer's official website (e.g. <strong style={{ color: "#00f0ff" }}>slayeresport.mydomain.com</strong>).
                    </p>

                    <div style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px dashed rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "24px",
                        textAlign: "left"
                    }}>
                        <h4 style={{ color: "#00f0ff", fontSize: "14px", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaGlobe /> Want to join tournaments?
                        </h4>
                        <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>
                            Open the specific tournament organizer website link given by your scrim host or clan leader to login.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link 
                            to="/organizer/login"
                            style={{
                                background: "linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)",
                                color: "#050914",
                                fontWeight: "700",
                                fontSize: "14px",
                                padding: "12px 20px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                            }}
                        >
                            <FaRocket /> Organizer Login Console
                        </Link>

                        <Link 
                            to="/"
                            style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "14px",
                                padding: "12px 20px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                border: "1px solid rgba(255, 255, 255, 0.15)"
                            }}
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const orgName = tenant?.organizationName || "Organizer Arena";

    const login = async () => {
        if (!email || !pass) {
            setErrorMessage("Please enter both email and password");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-slug": tenantSlug
                },
                body: JSON.stringify({ email, pass, org_slug: tenantSlug })
            });

            const res_data = await res.json();

            if (res.status === 200) {
                localStorage.setItem("jwt", res_data.token);
                navigate(`/profile`);
            } else {
                setErrorMessage(res_data.msg || res_data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login request error:", err);
            setErrorMessage("Login request failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login">
                <div className="card">
                    <Logo />
                    <div className="login_card">
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#00f0ff", fontSize: "13px", fontWeight: "700", marginBottom: "8px" }}>
                            <FaShieldAlt /> {orgName.toUpperCase()}
                        </div>
                        <h1>Player <span>Login</span></h1>
                        <p style={{ 'color': 'silver' }}>
                            Login to your account for <strong style={{ color: "#00f0ff" }}>{orgName}</strong> to join matches and access your room IDs.
                        </p>
                        
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            placeholder="Player Email Address" 
                            className="data" 
                            required 
                        />
                        <input 
                            value={pass} 
                            onChange={(e) => setPass(e.target.value)} 
                            type="password" 
                            placeholder="Password" 
                            className="data" 
                            required 
                        />
                        
                        {errorMessage && (
                            <div style={{
                                background: "rgba(255, 70, 85, 0.2)",
                                border: "1px solid #ff4655",
                                color: "#ff4655",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                marginBottom: "12px",
                                textAlign: "center"
                            }}>
                                {errorMessage}
                            </div>
                        )}
                        
                        <button className="login_btn" onClick={() => login()} disabled={loading}>
                            {loading ? "Logging in..." : "Login to Arena"}
                        </button>

                        <p style={{ marginTop: "14px" }}>Don't have an account on {orgName} yet?</p>
                        <button onClick={() => navigate("/signup")}>Register on {orgName}</button>
                    </div>
                    <small>By continuing you agree with {orgName} <Link to="#">Terms</Link> and <Link to="#">Fair-play Rules</Link></small>
                </div>
            </div>
        </>
    );
}