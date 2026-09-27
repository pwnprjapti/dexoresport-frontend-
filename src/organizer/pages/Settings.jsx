import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ControlPanel from "../compo/controlPanel";
import styles from "../css/settings.module.css";
import Loading from "../compo/Loading";
import OrganizerPaymentGateway from "../compo/OrganizerPaymentGateway";
import { FaGlobe, FaCopy, FaExternalLinkAlt, FaCheck, FaPalette, FaShareAlt, FaBuilding } from "react-icons/fa";

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        organizationName: "",
        slug: "",
        tagline: "",
        about: "",
        phone_number: "",
        whatsapp_number: "",
        state: "",
        city: "",
        branding: {
            logo: "",
            banner: "",
            primaryColor: "#00f0ff",
            accentColor: "#ff4655"
        },
        socialLinks: {
            youtube: "",
            instagram: "",
            discord: "",
            whatsapp: ""
        }
    });

    const getWebsiteUrl = () => {
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';
        const currentSlug = settings.slug || "organization";

        if (hostname.includes("localhost") || hostname === "127.0.0.1") {
            return `http://${currentSlug}.localhost${port}`;
        }
        const rootDomain = hostname.split(".").slice(-2).join(".");
        return `https://${currentSlug}.${rootDomain}`;
    };

    const fetchOrgProfile = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/organizer/login");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                navigate("/organizer/login");
                return;
            }

            const data = await res.json();
            if (data && typeof data === "object") {
                setSettings({
                    organizationName: data.organizationName || "",
                    slug: data.slug || data.subdomain || "",
                    tagline: data.tagline || "",
                    about: data.about || "",
                    phone_number: data.phone_number || "",
                    whatsapp_number: data.whatsapp_number || "",
                    state: data.state || "",
                    city: data.city || "",
                    branding: {
                        logo: data.branding?.logo || "",
                        banner: data.branding?.banner || "",
                        primaryColor: data.branding?.primaryColor || "#00f0ff",
                        accentColor: data.branding?.accentColor || "#ff4655"
                    },
                    socialLinks: {
                        youtube: data.socialLinks?.youtube || data.youtube_channel || "",
                        instagram: data.socialLinks?.instagram || data.instagram || "",
                        discord: data.socialLinks?.discord || data.discord || "",
                        whatsapp: data.socialLinks?.whatsapp || data.whatsapp_group || ""
                    }
                });
            }
        } catch (err) {
            console.error("Failed to fetch settings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgProfile();
    }, [navigate]);

    if (loading) {
        return <Loading />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBrandingChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            branding: {
                ...prev.branding,
                [name]: value
            }
        }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleCopyUrl = () => {
        const url = getWebsiteUrl();
        navigator.clipboard.writeText(url);
        setStatusMsg("Website URL copied to clipboard!");
        setTimeout(() => setStatusMsg(""), 3000);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMsg("");

        try {
            const token = localStorage.getItem("jwt");
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/website-settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            const data = await res.json();
            if (res.ok) {
                setStatusMsg("Website branding & configurations saved successfully!");
                setTimeout(() => setStatusMsg(""), 4000);
            } else {
                setStatusMsg(`Error: ${data.error || "Failed to save settings"}`);
            }
        } catch (err) {
            console.error("Save settings error:", err);
            setStatusMsg("Network error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const currentUrl = getWebsiteUrl();

    return (
        <>
            <ControlPanel />
            <div className={styles.settingsContainer}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>Website Customizer & Settings</h1>
                        <p>Customize your dedicated organization website, branding colors, domain slug, and payout gateway.</p>
                    </div>
                </div>

                {/* Prominent Website Live Card */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(112, 0, 255, 0.15) 100%)",
                    border: "1px solid rgba(0, 240, 255, 0.35)",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#00ff59",
                                boxShadow: "0 0 10px #00ff59",
                                display: "inline-block"
                            }}></span>
                            <span style={{ color: "#00ff59", fontWeight: "700", fontSize: "12px", textTransform: "uppercase" }}>Your Website is LIVE</span>
                        </div>
                        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "800", margin: "0 0 6px 0" }}>
                            {settings.organizationName || "Your Organization"}
                        </h2>
                        <div style={{ color: "#00f0ff", fontFamily: "monospace", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FaGlobe /> {currentUrl}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button
                            type="button"
                            onClick={handleCopyUrl}
                            style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                color: "#fff",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            <FaCopy /> Copy Link
                        </button>
                        
                        <a
                            href={currentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: "linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)",
                                color: "#050914",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "700",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                boxShadow: "0 4px 15px rgba(0, 240, 255, 0.3)"
                            }}
                        >
                            <FaExternalLinkAlt /> Visit My Website
                        </a>
                    </div>
                </div>

                {statusMsg && (
                    <div style={{
                        padding: "12px 20px",
                        background: statusMsg.startsWith("Error") ? "rgba(255, 70, 85, 0.2)" : "rgba(0, 255, 89, 0.2)",
                        border: `1px solid ${statusMsg.startsWith("Error") ? "#ff4655" : "#00ff59"}`,
                        borderRadius: "8px",
                        color: statusMsg.startsWith("Error") ? "#ff4655" : "#00ff59",
                        marginBottom: "20px",
                        fontWeight: "600"
                    }}>
                        {statusMsg}
                    </div>
                )}

                <form className={styles.settingsForm} onSubmit={handleSave}>
                    {/* Organization details */}
                    <div className={styles.sectionCard}>
                        <h3><FaBuilding style={{ marginRight: "8px", color: "#00f0ff" }} /> Organization Profile & Subdomain</h3>
                        <p className={styles.sectionDesc}>Customize your public organizer profile and domain address.</p>
                        
                        <div className={styles.formGroup}>
                            <label>Organization Name</label>
                            <input 
                                type="text" 
                                name="organizationName" 
                                value={settings.organizationName} 
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Website Subdomain Slug (e.g. organizationname.mydomain.com)</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input 
                                    type="text" 
                                    name="slug" 
                                    value={settings.slug} 
                                    onChange={handleChange}
                                    placeholder="slayeresport"
                                    required 
                                />
                                <span style={{ color: "#94a3b8", fontSize: "14px", whiteSpace: "nowrap" }}>.mydomain.com</span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Headline / Tagline</label>
                            <input 
                                type="text" 
                                name="tagline" 
                                value={settings.tagline} 
                                onChange={handleChange}
                                placeholder="Official Esports Arena & Daily BGMI Scrims" 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>About / Bio (Shown to players on your home page)</label>
                            <textarea 
                                name="about" 
                                rows="3"
                                value={settings.about} 
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    background: "#080c14",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    padding: "10px",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            />
                        </div>
                    </div>

                    {/* Branding & Theme */}
                    <div className={styles.sectionCard}>
                        <h3><FaPalette style={{ marginRight: "8px", color: "#fe26f4" }} /> Website Branding & Colors</h3>
                        <p className={styles.sectionDesc}>Upload your logo and choose theme colors for your player portal.</p>
                        
                        <div className={styles.formGroup}>
                            <label>Logo Image URL</label>
                            <input 
                                type="url" 
                                name="logo" 
                                value={settings.branding.logo} 
                                onChange={handleBrandingChange}
                                placeholder="https://res.cloudinary.com/.../logo.png" 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Banner Image URL</label>
                            <input 
                                type="url" 
                                name="banner" 
                                value={settings.branding.banner} 
                                onChange={handleBrandingChange}
                                placeholder="https://res.cloudinary.com/.../banner.jpg" 
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div className={styles.formGroup}>
                                <label>Primary Accent Color</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <input 
                                        type="color" 
                                        name="primaryColor" 
                                        value={settings.branding.primaryColor || "#00f0ff"} 
                                        onChange={handleBrandingChange}
                                        style={{ width: "50px", height: "40px", padding: "2px", background: "transparent", border: "none", cursor: "pointer" }}
                                    />
                                    <input 
                                        type="text" 
                                        name="primaryColor" 
                                        value={settings.branding.primaryColor || "#00f0ff"} 
                                        onChange={handleBrandingChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Secondary Accent Color</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <input 
                                        type="color" 
                                        name="accentColor" 
                                        value={settings.branding.accentColor || "#ff4655"} 
                                        onChange={handleBrandingChange}
                                        style={{ width: "50px", height: "40px", padding: "2px", background: "transparent", border: "none", cursor: "pointer" }}
                                    />
                                    <input 
                                        type="text" 
                                        name="accentColor" 
                                        value={settings.branding.accentColor || "#ff4655"} 
                                        onChange={handleBrandingChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Channels */}
                    <div className={styles.sectionCard}>
                        <h3><FaShareAlt style={{ marginRight: "8px", color: "#ffd700" }} /> Social Channels for Players</h3>
                        <p className={styles.sectionDesc}>These links are rendered on your website header and footer for players to join.</p>
                        
                        <div className={styles.formGroup}>
                            <label>YouTube Channel Link</label>
                            <input 
                                type="url" 
                                name="youtube" 
                                value={settings.socialLinks.youtube} 
                                onChange={handleSocialChange}
                                placeholder="https://youtube.com/@yourchannel" 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Discord Server Invite Link</label>
                            <input 
                                type="url" 
                                name="discord" 
                                value={settings.socialLinks.discord} 
                                onChange={handleSocialChange}
                                placeholder="https://discord.gg/yourserver" 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Instagram Profile Link</label>
                            <input 
                                type="url" 
                                name="instagram" 
                                value={settings.socialLinks.instagram} 
                                onChange={handleSocialChange}
                                placeholder="https://instagram.com/yourhandle" 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>WhatsApp Community / Group Link</label>
                            <input 
                                type="url" 
                                name="whatsapp" 
                                value={settings.socialLinks.whatsapp} 
                                onChange={handleSocialChange}
                                placeholder="https://chat.whatsapp.com/..." 
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.btnSave} disabled={saving}>
                        {saving ? "Saving Changes..." : "Save Website Branding & Settings"}
                    </button>
                </form>

                <div style={{ marginTop: "40px" }}>
                    <OrganizerPaymentGateway />
                </div>
            </div>
        </>
    );
}
