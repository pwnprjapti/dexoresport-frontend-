import styles from "../css/AdminLayout.module.css";
import { MdMenu, MdRefresh } from "react-icons/md";
import { useLocation } from "react-router-dom";

export default function AdminHeader({ onToggleSidebar, onRefresh }) {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === "/admin" || path === "/admin/dashboard") return "Platform Dashboard";
        if (path.includes("/admin/organizers")) return "Organizers & Applications";
        if (path.includes("/admin/tournaments")) return "Tournaments Controller";
        if (path.includes("/admin/players")) return "Players Directory";
        if (path.includes("/admin/leaderboard")) return "Master Leaderboard";
        if (path.includes("/admin/announcements")) return "Global Announcements";
        if (path.includes("/admin/settings")) return "System Health & Settings";
        return "Master Admin";
    };

    return (
        <header className={styles.topNav}>
            <div className={styles.topNavLeft}>
                <button className={styles.mobileMenuBtn} onClick={onToggleSidebar}>
                    <MdMenu />
                </button>
                <div className={styles.breadcrumb}>
                    <span>Dexor Master</span>
                    <span>/</span>
                    <span className={styles.breadcrumbCurrent}>{getPageTitle()}</span>
                </div>
            </div>

            <div className={styles.topNavRight}>
                <div className={styles.serverIndicator}>
                    <span className={styles.statusDot}></span>
                    <span>Server Live (Port 3000)</span>
                </div>

                {onRefresh && (
                    <button className={styles.topActionBtn} onClick={onRefresh} title="Sync Platform Data">
                        <MdRefresh style={{ fontSize: "16px" }} />
                        <span>Refresh</span>
                    </button>
                )}
            </div>
        </header>
    );
}
