import { useState, useEffect } from "react"
import ControlPanel from "../compo/controlPanel"
import styles from "../css/analytics.module.css"
import Loading from "../compo/Loading"

export default function Analytics() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }
    // Mock data for BGMI Tournament Analytics
    const stats = {
        totalEarnings: "₹2,45,600",
        slotsFilled: "450 / 600",
        matchesHosted: "182 Matches",
        peakViewers: "24,500 Live"
    };

    const weeklyRegistrations = [
        { day: "Mon", count: 42 },
        { day: "Tue", count: 58 },
        { day: "Wed", count: 75 },
        { day: "Thu", count: 90 },
        { day: "Fri", count: 120 },
        { day: "Sat", count: 145 },
        { day: "Sun", count: 110 }
    ];

    // Top 5 BGMI Clans Leaderboard
    const topClans = [
        { rank: 1, name: "GodLike Esports", matches: 45, wins: 18, winRate: "78%", kills: 382 },
        { rank: 2, name: "Soul Warriors", matches: 42, wins: 15, winRate: "71%", kills: 345 },
        { rank: 3, name: "TX Clan", matches: 38, wins: 12, winRate: "65%", kills: 290 },
        { rank: 4, name: "Reckoning Esports", matches: 32, wins: 9, winRate: "58%", kills: 245 },
        { rank: 5, name: "Team Xspark", matches: 30, wins: 8, winRate: "53%", kills: 210 }
    ];

    const maxCount = Math.max(...weeklyRegistrations.map(r => r.count));

    return (
        <>
            <ControlPanel />
            <div className={styles.analyticsContainer}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>Esports Analytics Console</h1>
                        <p>Real-time tournament metrics, clan statistics, and registration reports.</p>
                    </div>
                </div>

                {/* BGMI Tournament Organizer Metric Summary */}
                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon} style={{ color: "#ffd700" }}>
                            <i className="fa-solid fa-indian-rupee-sign"></i>
                        </div>
                        <div className={styles.metricInfo}>
                            <small>Total Revenue</small>
                            <h3>{stats.totalEarnings}</h3>
                        </div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon} style={{ color: "#00f0ff" }}>
                            <i className="fa-solid fa-eye"></i>
                        </div>
                        <div className={styles.metricInfo}>
                            <small>Peak Viewership</small>
                            <h3>{stats.peakViewers}</h3>
                        </div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon} style={{ color: "#fe26f4" }}>
                            <i className="fa-solid fa-ticket"></i>
                        </div>
                        <div className={styles.metricInfo}>
                            <small>Slots Filled</small>
                            <h3>{stats.slotsFilled}</h3>
                        </div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon} style={{ color: "#ffa600" }}>
                            <i className="fa-solid fa-gamepad"></i>
                        </div>
                        <div className={styles.metricInfo}>
                            <small>Matches Hosted</small>
                            <h3>{stats.matchesHosted}</h3>
                        </div>
                    </div>
                </div>

                {/* Visual Charts Section */}
                <div className={styles.chartsSection}>
                    {/* Weekly Registrations Chart */}
                    <div className={styles.chartCard}>
                        <h3>Weekly Registration Trends</h3>
                        <p>Daily player registration analytics for the current week.</p>
                        <div className={styles.barChartContainer}>
                            <div className={styles.chartYAxis}>
                                <span>{maxCount}</span>
                                <span>{Math.round(maxCount / 2)}</span>
                                <span>0</span>
                            </div>
                            <div className={styles.chartWrapper}>
                                <div className={styles.barsArea}>
                                    {weeklyRegistrations.map((item, idx) => {
                                        const percentHeight = (item.count / maxCount) * 100;
                                        return (
                                            <div className={styles.barCol} key={idx}>
                                                <div className={styles.barTooltip}>{item.count} players</div>
                                                <div 
                                                    className={styles.barProgress} 
                                                    style={{ height: `${percentHeight}%` }}
                                                ></div>
                                                <span className={styles.barLabel}>{item.day}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slot Utilization Donut */}
                    <div className={styles.donutCard}>
                        <h3>Slot Utilization</h3>
                        <p>Tournament capacity details.</p>
                        <div className={styles.progressCircleArea}>
                            <div className={styles.progressCircle}>
                                <div className={styles.circleOuter}>
                                    <div className={styles.circleInner}>
                                        <h3>75%</h3>
                                        <small>Capacity Filled</small>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.circleLegend}>
                                <div className={styles.legendItem}>
                                    <span className={styles.dotFilled}></span>
                                    <span>Filled: 450 Slots</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.dotEmpty}></span>
                                    <span>Available: 150 Slots</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BGMI Specific Analytics: Top 5 Clans & Gameplay Metrics */}
                <div className={styles.gameplaySection}>
                    {/* Top 5 Registered Clans Leaderboard */}
                    <div className={styles.clansCard}>
                        <div className={styles.sectionHeader}>
                            <h3>Top 5 BGMI Clans</h3>
                            <span className={styles.badgeLabel}>Esports Win-Rate</span>
                        </div>
                        <p className={styles.sectionSubtitle}>Top performing registered teams based on match success.</p>
                        
                        <div className={styles.clansTableWrapper}>
                            <table className={styles.clansTable}>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Clan Name</th>
                                        <th>Matches</th>
                                        <th>Wins</th>
                                        <th>Total Kills</th>
                                        <th>Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topClans.map(clan => (
                                        <tr key={clan.rank}>
                                            <td className={styles.rankCell}>
                                                <span className={`${styles.rankBadge} ${styles[`rank${clan.rank}`]}`}>
                                                    {clan.rank}
                                                </span>
                                            </td>
                                            <td className={styles.clanNameCell}>{clan.name}</td>
                                            <td>{clan.matches}</td>
                                            <td className={styles.winCount}>{clan.wins}</td>
                                            <td className={styles.killCount}>{clan.kills}</td>
                                            <td className={styles.rateCell}>{clan.winRate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Gameplay & In-Game Metrics */}
                    <div className={styles.matchStatsCard}>
                        <h3>In-Game Statistics</h3>
                        <p className={styles.sectionSubtitle}>Detailed gameplay statistics across all lobbies.</p>
                        
                        <div className={styles.statsList}>
                            <div className={styles.statsItem}>
                                <div className={styles.statsLabel}>
                                    <i className="fa-solid fa-skull-crossbones"></i>
                                    <span>Total Kills Recorded</span>
                                </div>
                                <span className={styles.statsValue}>4,820 Kills</span>
                            </div>
                            <div className={styles.statsItem}>
                                <div className={styles.statsLabel}>
                                    <i className="fa-solid fa-crown"></i>
                                    <span>Current MVP Leader</span>
                                </div>
                                <span className={styles.statsValue} style={{ color: "#ffd700" }}>Jonathan (GodL)</span>
                            </div>
                            <div className={styles.statsItem}>
                                <div className={styles.statsLabel}>
                                    <i className="fa-solid fa-map-location-dot"></i>
                                    <span>Most Popular Map</span>
                                </div>
                                <span className={styles.statsValue}>Erangel (68%)</span>
                            </div>
                            <div className={styles.statsItem}>
                                <div className={styles.statsLabel}>
                                    <i className="fa-solid fa-hourglass-half"></i>
                                    <span>Avg. Match Duration</span>
                                </div>
                                <span className={styles.statsValue}>24.5 Mins</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
