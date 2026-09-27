import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../compo/AdminLayout";
import styles from "../css/AdminDashboard.module.css";
import tableStyles from "../css/AdminTables.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdPeople, 
  MdEmojiEvents, 
  MdSportsEsports, 
  MdAttachMoney, 
  MdCheckCircle, 
  MdHourglassTop, 
  MdLiveTv, 
  MdArrowForward,
  MdAdd,
  MdCampaign, 
  MdLeaderboard,
  MdSecurity
} from "react-icons/md";

export default function AdminDashboard() {
    const { adminToken } = useAdminAuth();
    const [stats, setStats] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error("Error fetching admin stats:", err);
        }
    }, [adminToken]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <AdminLayout onRefresh={fetchStats}>
            <div className={styles.dashboardContainer}>
                {/* Welcome Banner */}
                <div className={styles.welcomeBanner}>
                    <div className={styles.welcomeText}>
                        <h1>Welcome to <span>Master Command</span></h1>
                        <p>
                            Real-time platform overview across all gaming leagues, tournament organizers, 
                            player rosters, room credentials, and prize pool transactions.
                        </p>
                    </div>
                    <div className={styles.systemBadgeContainer}>
                        <div className={styles.systemPill}>
                            <span className={styles.systemPillLabel}>Server Uptime</span>
                            <span className={styles.systemPillValue}>{stats?.systemInfo?.uptime || 0}s</span>
                        </div>
                        <div className={styles.systemPill}>
                            <span className={styles.systemPillLabel}>Node Heap</span>
                            <span className={styles.systemPillValue}>{stats?.systemInfo?.memoryUsage || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {/* 4 Core KPI Stat Cards */}
                <div className={styles.statsGrid}>
                    {/* Players KPI */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Registered Players</span>
                            <div className={styles.statIconBox} style={{ background: "rgba(0, 240, 255, 0.1)", color: "#00f0ff" }}>
                                <MdSportsEsports />
                            </div>
                        </div>
                        <div className={styles.statValueRow}>
                            <span className={styles.statValue}>{stats?.players?.total || 0}</span>
                            <span className={styles.statSubtext}>active accounts</span>
                        </div>
                        <div className={styles.statFooter}>
                            <span className={styles.statBadgePositive}>
                                <MdCheckCircle /> {stats?.players?.verified || 0} Verified
                            </span>
                        </div>
                    </div>

                    {/* Organizers KPI */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Organizers</span>
                            <div className={styles.statIconBox} style={{ background: "rgba(138, 43, 226, 0.1)", color: "#8a2be2" }}>
                                <MdPeople />
                            </div>
                        </div>
                        <div className={styles.statValueRow}>
                            <span className={styles.statValue}>{stats?.organizers?.total || 0}</span>
                            <span className={styles.statSubtext}>verified hosts</span>
                        </div>
                        <div className={styles.statFooter}>
                            <span className={styles.statBadgeAlert}>
                                <MdHourglassTop /> {stats?.organizers?.pending || 0} Pending Approvals
                            </span>
                        </div>
                    </div>

                    {/* Tournaments KPI */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Total Tournaments</span>
                            <div className={styles.statIconBox} style={{ background: "rgba(0, 255, 136, 0.1)", color: "#00ff88" }}>
                                <MdEmojiEvents />
                            </div>
                        </div>
                        <div className={styles.statValueRow}>
                            <span className={styles.statValue}>{stats?.tournaments?.total || 0}</span>
                            <span className={styles.statSubtext}>arenas hosted</span>
                        </div>
                        <div className={styles.statFooter}>
                            <span className={styles.statBadgePositive}>
                                <MdLiveTv /> {stats?.tournaments?.live || 0} Live Now
                            </span>
                            <span style={{ color: "#64748b" }}>•</span>
                            <span style={{ color: "#00f0ff", fontSize: "11.5px" }}>
                                {stats?.tournaments?.upcoming || 0} Upcoming
                            </span>
                        </div>
                    </div>

                    {/* Prize Pool KPI */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Total Prize Pool</span>
                            <div className={styles.statIconBox} style={{ background: "rgba(255, 170, 0, 0.1)", color: "#ffaa00" }}>
                                <MdAttachMoney />
                            </div>
                        </div>
                        <div className={styles.statValueRow}>
                            <span className={styles.statValue}>₹{(stats?.tournaments?.totalPrizePool || 0).toLocaleString()}</span>
                            <span className={styles.statSubtext}>INR pool</span>
                        </div>
                        <div className={styles.statFooter}>
                            <span style={{ color: "#94a3b8", fontSize: "11.5px" }}>
                                Across all active battle royales
                            </span>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                   DEDICATED SPACIOUS CORE OPERATIONS COMMAND HUB
                   ========================================================= */}
                <div className={styles.coreOperationsSection}>
                    <div className={styles.sectionTitleRow}>
                        <div className={styles.titleWithIcon}>
                            <div className={styles.sectionHeaderIcon}>
                                <MdSportsEsports />
                            </div>
                            <div>
                                <h2>Core Operations Command Hub</h2>
                                <p>High-level mission control across esports arenas, host validations, rosters, and broadcasts</p>
                            </div>
                        </div>
                        <span className={styles.operationsStatusBadge}>
                            <span className={styles.statusPulseDot}></span> System Live & Operational
                        </span>
                    </div>

                    <div className={styles.coreOpsGrid}>
                        {/* Card 1: Tournaments Controller */}
                        <Link to="/admin/tournaments" className={styles.coreOpCard}>
                            <div className={styles.coreOpCardTop}>
                                <div className={styles.coreOpIconBox} style={{ background: "rgba(0, 240, 255, 0.12)", color: "#00f0ff" }}>
                                    <MdEmojiEvents />
                                </div>
                                <span className={styles.coreOpTag}>Tournaments</span>
                            </div>
                            <div className={styles.coreOpContent}>
                                <h3>Tournaments Controller</h3>
                                <p>Launch official esports championships, push Room ID / Password credentials, and manage match progression.</p>
                            </div>
                            <div className={styles.coreOpFooter}>
                                <span className={styles.coreOpMetric}><strong>{stats?.tournaments?.total || 0}</strong> Total Arenas</span>
                                <span className={styles.coreOpArrow}>Manage Arenas <MdArrowForward /></span>
                            </div>
                        </Link>

                        {/* Card 2: Organizers & KYC */}
                        <Link to="/admin/organizers" className={styles.coreOpCard}>
                            <div className={styles.coreOpCardTop}>
                                <div className={styles.coreOpIconBox} style={{ background: "rgba(138, 43, 226, 0.12)", color: "#8a2be2" }}>
                                    <MdPeople />
                                </div>
                                <span className={styles.coreOpTag} style={{ color: "#ffaa00", borderColor: "rgba(255, 170, 0, 0.3)", background: "rgba(255, 170, 0, 0.1)" }}>
                                    {stats?.organizers?.pending || 0} Pending
                                </span>
                            </div>
                            <div className={styles.coreOpContent}>
                                <h3>Organizers & KYC Desk</h3>
                                <p>Review incoming host applications, verify organization identities, and approve or reject organizer licenses.</p>
                            </div>
                            <div className={styles.coreOpFooter}>
                                <span className={styles.coreOpMetric}><strong>{stats?.organizers?.total || 0}</strong> Registered Hosts</span>
                                <span className={styles.coreOpArrow}>Review KYC <MdArrowForward /></span>
                            </div>
                        </Link>

                        {/* Card 3: Players Directory */}
                        <Link to="/admin/players" className={styles.coreOpCard}>
                            <div className={styles.coreOpCardTop}>
                                <div className={styles.coreOpIconBox} style={{ background: "rgba(0, 255, 136, 0.12)", color: "#00ff88" }}>
                                    <MdSportsEsports />
                                </div>
                                <span className={styles.coreOpTag}>Rosters</span>
                            </div>
                            <div className={styles.coreOpContent}>
                                <h3>Players Directory</h3>
                                <p>Lookup BGMI UIDs, verify in-game names (IGN), inspect prize earnings, ban fraudulent accounts, and audit team squads.</p>
                            </div>
                            <div className={styles.coreOpFooter}>
                                <span className={styles.coreOpMetric}><strong>{stats?.players?.total || 0}</strong> Gamers</span>
                                <span className={styles.coreOpArrow}>View Directory <MdArrowForward /></span>
                            </div>
                        </Link>

                        {/* Card 4: Leaderboard Sync */}
                        <Link to="/admin/leaderboard" className={styles.coreOpCard}>
                            <div className={styles.coreOpCardTop}>
                                <div className={styles.coreOpIconBox} style={{ background: "rgba(255, 170, 0, 0.12)", color: "#ffaa00" }}>
                                    <MdLeaderboard />
                                </div>
                                <span className={styles.coreOpTag}>Standings</span>
                            </div>
                            <div className={styles.coreOpContent}>
                                <h3>Master Leaderboard</h3>
                                <p>Synchronize competitive standings, calculate player kill points, update rankings, and reward champions.</p>
                            </div>
                            <div className={styles.coreOpFooter}>
                                <span className={styles.coreOpMetric}>Real-Time Rankings</span>
                                <span className={styles.coreOpArrow}>Sync Standings <MdArrowForward /></span>
                            </div>
                        </Link>

                        {/* Card 5: Global Announcements */}
                        <Link to="/admin/announcements" className={styles.coreOpCard}>
                            <div className={styles.coreOpCardTop}>
                                <div className={styles.coreOpIconBox} style={{ background: "rgba(255, 0, 119, 0.12)", color: "#ff0077" }}>
                                    <MdCampaign />
                                </div>
                                <span className={styles.coreOpTag}>Broadcast</span>
                            </div>
                            <div className={styles.coreOpContent}>
                                <h3>Global Broadcast Alerts</h3>
                                <p>Push instant notifications, server maintenance warnings, and championship alert bulletins across the platform.</p>
                            </div>
                            <div className={styles.coreOpFooter}>
                                <span className={styles.coreOpMetric}>All Audiences</span>
                                <span className={styles.coreOpArrow}>Send Alert <MdArrowForward /></span>
                            </div>
                        </Link>

                        {/* Card 6: Master Security & Keys */}
                        <Link to="/admin/settings" className={styles.coreOpCard}>
                            <div className={styles.coreOpCardTop}>
                                <div className={styles.coreOpIconBox} style={{ background: "rgba(0, 240, 255, 0.12)", color: "#00f0ff" }}>
                                    <MdSecurity />
                                </div>
                                <span className={styles.coreOpTag}>Security</span>
                            </div>
                            <div className={styles.coreOpContent}>
                                <h3>System Health & Keys</h3>
                                <p>Check backend cluster metrics, database connectivity, heap allocation, and update master security keys.</p>
                            </div>
                            <div className={styles.coreOpFooter}>
                                <span className={styles.coreOpMetric}>Node {stats?.systemInfo?.uptime || 0}s</span>
                                <span className={styles.coreOpArrow}>Security Keys <MdArrowForward /></span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Two Column Layout: Recent Tournaments & Quick Controls */}
                <div className={styles.twoColSection}>
                    {/* Left: Recent Tournaments */}
                    <div className={styles.sectionCard}>
                        <div className={styles.cardHeader}>
                            <h3><MdEmojiEvents style={{ color: "#00f0ff" }} /> Recent Tournaments</h3>
                            <Link to="/admin/tournaments" className={styles.cardHeaderAction}>
                                View All Arenas <MdArrowForward />
                            </Link>
                        </div>

                        <div className={tableStyles.tableResponsive} data-lenis-prevent>
                            <table className={tableStyles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Tournament</th>
                                        <th>Prize Pool</th>
                                        <th>Slots</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!stats?.recent?.tournaments || stats.recent.tournaments.length === 0) ? (
                                        <tr>
                                            <td colSpan="5" className={tableStyles.emptyState}>No tournaments created yet</td>
                                        </tr>
                                    ) : (
                                        stats.recent.tournaments.map((tour) => (
                                            <tr key={tour._id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: "#fff" }}>
                                                        {tour.tournament_name || "Unnamed Tournament"}
                                                    </div>
                                                    <small style={{ color: "#64748b" }}>{tour.map || "Custom Map"}</small>
                                                </td>
                                                <td style={{ color: "#00ff88", fontWeight: 700 }}>
                                                    ₹{tour.prizepool || 0}
                                                </td>
                                                <td>
                                                    {(tour.enteries || []).length}/{tour.ttl_slots || 0}
                                                </td>
                                                <td>
                                                    <span className={`
                                                        ${tableStyles.badge} 
                                                        ${tour.stts === 'live' ? tableStyles.badgeLive : 
                                                          tour.stts === 'past' ? tableStyles.badgeNormal : tableStyles.badgeApproved}
                                                    `}>
                                                        {tour.stts || "upcoming"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link to="/admin/tournaments" className={tableStyles.actionBtn}>
                                                        Manage
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Master Quick Actions */}
                    <div className={styles.sectionCard}>
                        <div className={styles.cardHeader}>
                            <h3>Command Actions</h3>
                        </div>

                        <div className={styles.quickActionsList}>
                            <Link to="/admin/organizers" className={styles.quickActionItem}>
                                <div className={styles.quickActionLeft}>
                                    <div className={styles.quickActionIcon} style={{ background: "rgba(255, 170, 0, 0.15)", color: "#ffaa00" }}>
                                        <MdHourglassTop />
                                    </div>
                                    <div className={styles.quickActionDetails}>
                                        <h4>Review Organizers</h4>
                                        <p>{stats?.organizers?.pending || 0} pending applications waiting</p>
                                    </div>
                                </div>
                                <MdArrowForward style={{ color: "#64748b" }} />
                            </Link>

                            <Link to="/admin/tournaments" className={styles.quickActionItem}>
                                <div className={styles.quickActionLeft}>
                                    <div className={styles.quickActionIcon} style={{ background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff" }}>
                                        <MdAdd />
                                    </div>
                                    <div className={styles.quickActionDetails}>
                                        <h4>Launch Official Event</h4>
                                        <p>Create official Dexor Esports tournament</p>
                                    </div>
                                </div>
                                <MdArrowForward style={{ color: "#64748b" }} />
                            </Link>

                            <Link to="/admin/announcements" className={styles.quickActionItem}>
                                <div className={styles.quickActionLeft}>
                                    <div className={styles.quickActionIcon} style={{ background: "rgba(255, 0, 119, 0.15)", color: "#ff0077" }}>
                                        <MdCampaign />
                                    </div>
                                    <div className={styles.quickActionDetails}>
                                        <h4>Broadcast Announcement</h4>
                                        <p>Send urgent notification to platform</p>
                                    </div>
                                </div>
                                <MdArrowForward style={{ color: "#64748b" }} />
                            </Link>

                            <Link to="/admin/leaderboard" className={styles.quickActionItem}>
                                <div className={styles.quickActionLeft}>
                                    <div className={styles.quickActionIcon} style={{ background: "rgba(0, 255, 136, 0.15)", color: "#00ff88" }}>
                                        <MdLeaderboard />
                                    </div>
                                    <div className={styles.quickActionDetails}>
                                        <h4>Leaderboard Sync</h4>
                                        <p>Update top ranked players & points</p>
                                    </div>
                                </div>
                                <MdArrowForward style={{ color: "#64748b" }} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Organizers & Players Grid */}
                <div className={styles.twoColSection}>
                    {/* Recent Organizers */}
                    <div className={styles.sectionCard}>
                        <div className={styles.cardHeader}>
                            <h3><MdPeople style={{ color: "#8a2be2" }} /> Recent Organizer Applications</h3>
                            <Link to="/admin/organizers" className={styles.cardHeaderAction}>
                                View All <MdArrowForward />
                            </Link>
                        </div>

                        <div className={tableStyles.tableResponsive} data-lenis-prevent>
                            <table className={tableStyles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Organizer</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!stats?.recent?.organizers || stats.recent.organizers.length === 0) ? (
                                        <tr>
                                            <td colSpan="3" className={tableStyles.emptyState}>No organizers registered yet</td>
                                        </tr>
                                    ) : (
                                        stats.recent.organizers.map((org) => (
                                            <tr key={org._id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: "#fff" }}>{org.organizationName || org.name}</div>
                                                    <small style={{ color: "#64748b" }}>{org.name}</small>
                                                </td>
                                                <td>{org.email}</td>
                                                <td>
                                                    <span className={`
                                                        ${tableStyles.badge}
                                                        ${org.approved_stts === 'approved' ? tableStyles.badgeApproved : 
                                                          org.approved_stts === 'rejected' ? tableStyles.badgeRejected : tableStyles.badgePending}
                                                    `}>
                                                        {org.approved_stts || "pending"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Players */}
                    <div className={styles.sectionCard}>
                        <div className={styles.cardHeader}>
                            <h3><MdSportsEsports style={{ color: "#00f0ff" }} /> Recent Player Signups</h3>
                            <Link to="/admin/players" className={styles.cardHeaderAction}>
                                View All <MdArrowForward />
                            </Link>
                        </div>

                        <div className={tableStyles.tableResponsive} data-lenis-prevent>
                            <table className={tableStyles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Player</th>
                                        <th>IGN</th>
                                        <th>UID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!stats?.recent?.players || stats.recent.players.length === 0) ? (
                                        <tr>
                                            <td colSpan="3" className={tableStyles.emptyState}>No players registered yet</td>
                                        </tr>
                                    ) : (
                                        stats.recent.players.map((player) => (
                                            <tr key={player._id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: "#fff" }}>{player.name}</div>
                                                    <small style={{ color: "#64748b" }}>{player.email}</small>
                                                </td>
                                                <td style={{ color: "#00f0ff", fontWeight: 600 }}>{player.ign || "N/A"}</td>
                                                <td>{player.uid || "N/A"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
