import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import ControlPanel from "../compo/controlPanel"
import styles from "../css/overview.module.css"
import Loading from "../compo/Loading"

export default function Overview() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/public/announcements`);
                const data = await res.json();
                if (data.success && Array.isArray(data.announcements)) {
                    setAnnouncements(data.announcements.filter(a => a.active !== false && (a.target === "all" || a.target === "organizers")));
                }
            } catch (err) {
                console.error("Error fetching announcements:", err);
            }
        };
        fetchAnnouncements();
    }, []);

    if (loading) {
        return <Loading />;
    }

    // Mock data for Overview Page
    const stats = {
        activeTours: 12,
        totalPlayers: "1,240",
        walletBalance: "₹45,230",
        matchesToday: 8
    };

    const upcomingMatches = [
        { id: 1, name: "Match 4 - Erangel", tourName: "BGMI Ultimate Showdown", time: "Live Now", status: "live" },
        { id: 2, name: "Semi-Final Match 1", tourName: "Challengers Cup TDM", time: "09:30 PM", status: "upcoming" },
        { id: 3, name: "Match 1 - Miramar", tourName: "Sunday Showdown Classic", time: "May 24, 09:00 PM", status: "scheduled" }
    ];

    const slotProgress = [
        { name: "BGMI Ultimate Showdown", filled: 18, total: 20, pct: 90 },
        { name: "Challengers Cup TDM", filled: 8, total: 16, pct: 50 },
        { name: "Sunday Showdown Classic", filled: 24, total: 50, pct: 48 }
    ];

    const activities = [
        { id: 1, text: "Soul Warriors registered in BGMI Ultimate Showdown", time: "2 mins ago", icon: "fa-user-plus", color: "#00ff59" },
        { id: 2, text: "Generated match brackets for Challengers Cup TDM", time: "15 mins ago", icon: "fa-sitemap", color: "#00f0ff" },
        { id: 3, text: "Requested withdrawal of ₹15,000 to registered bank", time: "2 hours ago", icon: "fa-money-bill-transfer", color: "#fe26f4" },
        { id: 4, text: "Created a new tournament Sunday Showdown Classic", time: "5 hours ago", icon: "fa-folder-plus", color: "#ffd700" }
    ];

    return (
        <>
            <ControlPanel />
            <div className={styles.overviewContainer}>
                {/* Greeting Area */}
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>Overview Dashboard</h1>
                        <p>Welcome back, Organizer! Here is a summary of your active esports lobbies and registrations.</p>
                    </div>
                    <button className={styles.btnQuickCreate} onClick={() => navigate("/organizer/addtournament")}>
                        <i className="fa-solid fa-plus"></i> New Tournament
                    </button>
                </div>

                {/* Official Master Admin System Announcements */}
                {announcements.length > 0 && (
                    <div style={{
                        background: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(0, 240, 255, 0.35)",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        marginBottom: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{
                                    padding: "4px 10px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    background: announcements[0].priority === "urgent" ? "rgba(255, 30, 80, 0.2)" : "rgba(0, 240, 255, 0.15)",
                                    color: announcements[0].priority === "urgent" ? "#ff1e50" : "#00f0ff",
                                    border: `1px solid ${announcements[0].priority === "urgent" ? "rgba(255, 30, 80, 0.4)" : "rgba(0, 240, 255, 0.3)"}`
                                }}>
                                    {announcements[0].priority === "urgent" ? "🚨 Urgent Broadcast" : "📢 Official Notice"}
                                </span>
                                <strong style={{ color: "#fff", fontSize: "14px" }}>{announcements[0].title}</strong>
                            </div>
                            <span style={{ fontSize: "11px", color: "#64748b" }}>
                                From: {announcements[0].author || "Dexor Master Admin"}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
                            {announcements[0].content}
                        </p>
                    </div>
                )}

                {/* Grid stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                        <div className={styles.statIcon} style={{ background: "rgba(0, 240, 255, 0.1)", color: "#00f0ff" }}>
                            <i className="fa-solid fa-trophy"></i>
                        </div>
                        <div className={styles.statContent}>
                            <span>Active Tournaments</span>
                            <h3>{stats.activeTours}</h3>
                        </div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statIcon} style={{ background: "rgba(0, 255, 89, 0.1)", color: "#00ff59" }}>
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div className={styles.statContent}>
                            <span>Active Players</span>
                            <h3>{stats.totalPlayers}</h3>
                        </div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statIcon} style={{ background: "rgba(254, 38, 244, 0.1)", color: "#fe26f4" }}>
                            <i className="fa-solid fa-wallet"></i>
                        </div>
                        <div className={styles.statContent}>
                            <span>Wallet Balance</span>
                            <h3>{stats.walletBalance}</h3>
                        </div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statIcon} style={{ background: "rgba(255, 215, 0, 0.1)", color: "#ffd700" }}>
                            <i className="fa-solid fa-crosshairs"></i>
                        </div>
                        <div className={styles.statContent}>
                            <span>Matches Today</span>
                            <h3>{stats.matchesToday}</h3>
                        </div>
                    </div>
                </div>

                <div className={styles.dashboardLayout}>
                    {/* Left main: Upcoming schedules and slot states */}
                    <div className={styles.leftCol}>
                        {/* Upcoming Matches */}
                        <div className={styles.consoleCard}>
                            <h3>Upcoming Match Lobbies</h3>
                            <p className={styles.cardDesc}>Real-time lobby statuses and schedules for your matches.</p>
                            
                            <div className={styles.matchesList}>
                                {upcomingMatches.map(match => (
                                    <div className={styles.matchRow} key={match.id}>
                                        <div className={styles.matchInfo}>
                                            <span className={`${styles.statusDot} ${styles[match.status]}`}></span>
                                            <div>
                                                <h4>{match.name}</h4>
                                                <small>{match.tourName}</small>
                                            </div>
                                        </div>
                                        <div className={styles.matchTime}>
                                            <span className={`${styles.timeBadge} ${styles[match.status]}`}>
                                                {match.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Slots capacity progress */}
                        <div className={styles.consoleCard}>
                            <h3>Tournament Bookings Progress</h3>
                            <p className={styles.cardDesc}>Capacity metrics for registered lobbies.</p>
                            
                            <div className={styles.slotsList}>
                                {slotProgress.map((tour, idx) => (
                                    <div className={styles.slotRow} key={idx}>
                                        <div className={styles.slotLabels}>
                                            <span>{tour.name}</span>
                                            <span>{tour.filled}/{tour.total} Slots ({tour.pct}%)</span>
                                        </div>
                                        <div className={styles.progressBarBg}>
                                            <div 
                                                className={styles.progressBarFill} 
                                                style={{ width: `${tour.pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column: Recent Activity Feed */}
                    <div className={styles.rightCol}>
                        <div className={styles.consoleCard} style={{ height: "100%" }}>
                            <h3>Recent Actions Feed</h3>
                            <p className={styles.cardDesc}>Live activity log of organizer profile events.</p>
                            
                            <div className={styles.activityFeed}>
                                {activities.map(act => (
                                    <div className={styles.activityItem} key={act.id}>
                                        <div className={styles.activityIcon} style={{ borderColor: act.color, color: act.color }}>
                                            <i className={`fa-solid ${act.icon}`}></i>
                                        </div>
                                        <div className={styles.activityInfo}>
                                            <p>{act.text}</p>
                                            <small>{act.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
