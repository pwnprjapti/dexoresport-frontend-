import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/SystemAlertBanner.css";
import { FaBullhorn, FaExclamationTriangle, FaTimes, FaTools } from "react-icons/fa";

export default function SystemAlertBanner() {
    const [alert, setAlert] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchAlert = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/public/announcements`);
                const data = await res.json();
                if (data.success && Array.isArray(data.announcements) && data.announcements.length > 0) {
                    // Pick latest active announcement that user hasn't dismissed in this session
                    const latest = data.announcements.find((a) => {
                        const isDismissed = sessionStorage.getItem(`dismissed_alert_${a._id}`);
                        return a.active !== false && !isDismissed && (a.target === "all" || a.target === "players");
                    });

                    if (latest && isMounted) {
                        setAlert(latest);
                        setVisible(true);
                    }
                }
            } catch (err) {
                console.error("Error fetching system alerts:", err);
            }
        };

        fetchAlert();
        return () => { isMounted = false; };
    }, []);

    const handleDismiss = () => {
        if (alert?._id) {
            sessionStorage.setItem(`dismissed_alert_${alert._id}`, "true");
        }
        setVisible(false);
    };

    if (!visible || !alert) return null;

    const priorityClass = alert.priority === "urgent" ? "urgent" : alert.priority === "high" ? "high" : "normal";

    const getIcon = () => {
        if (alert.category === "maintenance") return <FaTools />;
        if (alert.priority === "urgent") return <FaExclamationTriangle />;
        return <FaBullhorn />;
    };

    return (
        <div className={`system-alert-banner ${priorityClass}`}>
            <div className="alert-banner-left">
                <span className="alert-tag-badge">
                    {getIcon()} {alert.category || "ALERT"}
                </span>
                <div className="alert-message-text">
                    <strong>{alert.title}:</strong>
                    <span>{alert.content}</span>
                </div>
            </div>

            <div className="alert-banner-actions">
                <Link to="/notification" className="alert-action-link">
                    View Details
                </Link>
                <button className="alert-close-btn" onClick={handleDismiss} title="Dismiss notification">
                    <FaTimes />
                </button>
            </div>
        </div>
    );
}
