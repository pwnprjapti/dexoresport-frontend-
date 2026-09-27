import styles from '../css/signup.module.css';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../compo/Logo.jsx';
import { useTenant } from '../../context/TenantContext.jsx';
import { useState } from 'react';
import { FaShieldAlt, FaRocket, FaGlobe, FaGamepad, FaLock, FaUser } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
    const navigate = useNavigate();
    const { isTenant, tenantSlug, tenant } = useTenant();

    const [manualForm, setManualForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // If on main domain, direct player registration is disabled
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
                        Player Registration Not Available Here
                    </h2>

                    <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                        Direct player registration on the main platform domain is disabled. Players must register directly through their tournament organizer's dedicated website (e.g., <strong style={{ color: "#00f0ff" }}>slayeresport.mydomain.com</strong>).
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
                            <FaGlobe /> How to create a player account:
                        </h4>
                        <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>
                            Ask your tournament host/organizer for their official website link or join their dedicated portal.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link 
                            to="/organizer/signup"
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
                            <FaRocket /> Are you an Organizer? Create Account
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

    const orgName = tenant?.organizationName || "Tournament Arena";

    const send_signupdata = async (usertoken, manualData = null) => {
        setIsSubmitting(true);
        setErrorMsg("");

        try {
            const csrfRes = await fetch(`${import.meta.env.VITE_BASE_URL}/getcsrf`, { credentials: 'include' });
            const csrfData = await csrfRes.json();

            const payload = manualData ? { ...manualData, org_slug: tenantSlug } : { usertoken, org_slug: tenantSlug };

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfData?.csrfToken || "",
                    "x-tenant-slug": tenantSlug
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.status === 409) {
                alert(`An account already exists for ${orgName} with this email. Please login.`);
                navigate('/login');
            } else if (res.status === 200) {
                navigate(`/signup/player/${data}`);
            } else {
                setErrorMsg(data?.error || data?.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            console.error("Signup error occurred:", err);
            setErrorMsg("Network error occurred during registration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        if (credentialResponse?.credential) {
            send_signupdata(credentialResponse.credential);
        }
    };

    const handleGoogleError = () => {
        setErrorMsg("Google Sign-In was unsuccessful. Please use direct email registration.");
        setManualForm(true);
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            return setErrorMsg("Please fill in both name and email");
        }
        send_signupdata(null, formData);
    };

    return (
        <>
            <Logo />
            <div className={styles.login}>
                <div className={styles.card}>                
                    <div>
                        <form className={styles.login_card} onSubmit={(e) => e.preventDefault()}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#00f0ff", fontSize: "13px", fontWeight: "700", marginBottom: "8px" }}>
                                <FaShieldAlt /> {orgName.toUpperCase()} OFFICIAL ARENA
                            </div>
                            <h2>Create Player Account</h2>
                            <p className={styles.txt}>
                                Registering under <strong style={{ color: "#00f0ff" }}>{orgName}</strong> to join verified BGMI matches.
                            </p> 

                            {errorMsg && (
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
                                    {errorMsg}
                                </div>
                            )}

                            {!manualForm ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                                    <button 
                                        type="button" 
                                        onClick={() => setManualForm(true)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "#94a3b8",
                                            fontSize: "12px",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                            marginTop: "6px"
                                        }}
                                    >
                                        Or register with name & email
                                    </button>
                                </div>
                            ) : (
                                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <input 
                                        type="text" 
                                        placeholder="Your Full Name" 
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="data" 
                                        required 
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Player Email Address" 
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="data" 
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleManualSubmit}
                                        disabled={isSubmitting}
                                        style={{
                                            background: "linear-gradient(135deg, #00f0ff, #0077ff)",
                                            color: "#050914",
                                            fontWeight: "700",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {isSubmitting ? "Registering..." : "Continue to Game Details"}
                                    </button>
                                </div>
                            )}

                            <div className={styles.info_box}>
                                <div className={styles.box}>
                                    <div className={styles.icon}><i className="fa-solid fa-bolt-lightning" style={{"color": "rgb(64, 2, 243)", fontSize: "xx-large"}}></i></div>
                                    <div className={styles.info}>
                                        <h3>Exclusive Arena</h3>
                                        <p>Account tied specifically to {orgName}</p>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <div className={styles.icon}><i className="fa-solid fa-shield" style={{"color": "rgb(64, 2, 243)", fontSize: "xx-large"}}></i></div>
                                    <div className={styles.info}>
                                        <h3>Anti-Cheat POV</h3>
                                        <p>100% fair competitive scrims</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
