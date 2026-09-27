import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../css/AdminLayout.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdDashboard, 
  MdPeople, 
  MdEmojiEvents, 
  MdSportsEsports, 
  MdLeaderboard, 
  MdCampaign, 
  MdSettings, 
  MdLogout, 
  MdArrowBack
} from "react-icons/md";

export default function AdminSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { adminUser, logoutAdmin } = useAdminAuth();

    const handleLogout = () => {
        logoutAdmin();
        navigate("/admin/login");
    };

    const coreOperations = [
        { label: "Dashboard", path: "/admin", icon: <MdDashboard />, badge: "Overview" },
        { label: "Tournaments", path: "/admin/tournaments", icon: <MdEmojiEvents />, badge: "Arenas" },
        { label: "Organizers & KYC", path: "/admin/organizers", icon: <MdPeople />, badge: "Verifications" },
        { label: "Players Directory", path: "/admin/players", icon: <MdSportsEsports />, badge: "Rosters" }
    ];

    const platformManagement = [
        { label: "Leaderboard", path: "/admin/leaderboard", icon: <MdLeaderboard />, badge: "Rankings" },
        { label: "Announcements", path: "/admin/announcements", icon: <MdCampaign />, badge: "Broadcast" },
        { label: "System Health & Keys", path: "/admin/settings", icon: <MdSettings />, badge: "Security" }
    ];

    const isCurrent = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
            {/* Branding Header */}
            <div className={styles.brandHeader}>
                <img 
                    src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" 
                    alt="Dexor Logo" 
                    className={styles.brandLogo} 
                />
                <div className={styles.brandTitle}>
                    <h2>Dexor<span>Esport</span></h2>
                    <span className={styles.badgeMaster}>Master Admin</span>
                </div>
            </div>

            {/* Navigation links - Spacious & Structured */}
            <nav className={styles.navSection} data-lenis-prevent>
                {/* Section 1: Core Operations */}
                <div className={styles.navCategory}>
                    <span>Core Operations</span>
                    <span className={styles.navCategoryTag}>4 Modules</span>
                </div>
                {coreOperations.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`${styles.navItem} ${isCurrent(item.path) ? styles.active : ""}`}
                        onClick={onClose}
                    >
                        <div className={styles.navItemLeft}>
                            <div className={styles.navIconBox}>{item.icon}</div>
                            <span className={styles.navItemLabel}>{item.label}</span>
                        </div>
                        {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                    </Link>
                ))}

                {/* Section 2: Platform Controls */}
                <div className={styles.navCategory}>
                    <span>Platform Controls</span>
                    <span className={styles.navCategoryTag}>System</span>
                </div>
                {platformManagement.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`${styles.navItem} ${isCurrent(item.path) ? styles.active : ""}`}
                        onClick={onClose}
                    >
                        <div className={styles.navItemLeft}>
                            <div className={styles.navIconBox}>{item.icon}</div>
                            <span className={styles.navItemLabel}>{item.label}</span>
                        </div>
                        {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                    </Link>
                ))}

                {/* Section 3: Platform Gateway */}
                <div className={styles.navCategory}>
                    <span>Platform Gateway</span>
                </div>
                <Link to="/" className={styles.navItem} onClick={onClose}>
                    <div className={styles.navItemLeft}>
                        <div className={styles.navIconBox}><MdArrowBack /></div>
                        <span className={styles.navItemLabel}>Back to Platform</span>
                    </div>
                    <span className={styles.navBadge}>Exit</span>
                </Link>
            </nav>

            {/* Admin Profile Pill & Logout */}
            <div className={styles.sidebarFooter}>
                <div className={styles.adminProfilePill}>
                    <img 
                        src={adminUser?.avatar || "https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780488368/c8d7aXD4SvWCL8_CMb5ZDQ_tmvj49.webp"} 
                        alt="Admin Avatar" 
                        className={styles.adminAvatar} 
                    />
                    <div className={styles.adminProfileInfo}>
                        <span className={styles.adminName}>{adminUser?.name || "Master Admin"}</span>
                        <span className={styles.adminRole}>Superuser</span>
                    </div>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                    <MdLogout />
                </button>
            </div>
        </aside>
    );
}
