import Nav from "../compo/nav";
import Footer from '../compo/Footer.jsx';
import "../css/leaderboard.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../compo/Loading.jsx";
import { useTenant } from "../../context/TenantContext.jsx";
import { FaTrophy, FaShieldAlt } from "react-icons/fa";

const Leaderboard = () => {
    const { id } = useParams();
    const { isTenant, tenantSlug, tenant } = useTenant();

    const [ loading, setLoading ] = useState(true);
    const [ data, setData ] = useState({ top3players: [], otherPlayers: [] });

    const getLeaderboard = async () => {
        try {
            setLoading(true);

            const leaderboardres = await fetch(`${import.meta.env.VITE_BASE_URL}/leaderboard`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-slug": tenantSlug || ""
                },
                body: JSON.stringify({ 
                    id, 
                    org: tenantSlug, 
                    org_slug: tenantSlug 
                })
            });

            if (leaderboardres.ok) {
                const leaderboardData = await leaderboardres.json();
                setData({
                    top3players: leaderboardData?.top3players || [],
                    otherPlayers: leaderboardData?.otherPlayers || []
                });
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLeaderboard();
    }, [id, tenantSlug]);

    const orgName = isTenant && tenant?.organizationName ? tenant.organizationName : "Official";

    return (
        <>
            { loading ? (
                <Loading /> 
            ) : (
                <>
                    <Nav />
                    <div className="container">
                        <div style={{ textAlign: "center", marginBottom: "30px", marginTop: "20px" }}>
                            <div style={{ 
                                display: "inline-flex", 
                                alignItems: "center", 
                                gap: "8px", 
                                background: "rgba(0, 240, 255, 0.1)", 
                                border: "1px solid rgba(0, 240, 255, 0.3)", 
                                padding: "6px 16px", 
                                borderRadius: "20px", 
                                color: "#00f0ff", 
                                fontSize: "13px", 
                                fontWeight: "700",
                                marginBottom: "10px"
                            }}>
                                <FaShieldAlt /> {orgName.toUpperCase()} VERIFIED RANKINGS
                            </div>
                            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", margin: 0 }}>
                                {orgName.toUpperCase()} <span style={{ color: "#00f0ff" }}>LEADERBOARD</span>
                            </h1>
                            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "6px" }}>
                                Official competitive rankings of verified squads and players in {orgName}.
                            </p>
                        </div>

                        <div className="top_winners">
                            <div className="winner second">
                                <div className="rank"><div className="innr_rank"><p>2</p></div></div>
                                <div className="dp"></div>
                                <h3>{data.top3players?.[1]?.player_name || 'No Player'}</h3>
                                <p>{data.top3players?.[1]?.points || 0} Points</p>
                                <div className="info">
                                    <div className="box"><p>{data.top3players?.[1]?.wins || 0}</p><small>Wins</small></div>
                                    <div className="box"><p>{data.top3players?.[1]?.kills || 0}</p><small>Kills</small></div>
                                    <div className="box"><p>{data.top3players?.[1]?.kd || 0}</p><small>K/D</small></div>
                                </div>
                            </div>
                            <div className="winner first">
                                <div className="rank"><div className="innr_rank"><p>1</p></div></div>
                                <div className="dp"></div>
                                <h3>{data.top3players?.[0]?.player_name || 'No Player'}</h3>
                                <p>{data.top3players?.[0]?.points || 0} Points</p>
                                <div className="info">
                                    <div className="box"><p>{data.top3players?.[0]?.wins || 0}</p><small>Wins</small></div>
                                    <div className="box"><p>{data.top3players?.[0]?.kills || 0}</p><small>Kills</small></div>
                                    <div className="box"><p>{data.top3players?.[0]?.kd || 0}</p><small>K/D</small></div>
                                </div>
                            </div>
                            <div className="winner third">
                                <div className="rank"><div className="innr_rank"><p>3</p></div></div>
                                <div className="dp"></div>
                                <h3>{data.top3players?.[2]?.player_name || 'No Player'}</h3>
                                <p>{data.top3players?.[2]?.points || 0} Points</p>
                                <div className="info">
                                    <div className="box"><p>{data.top3players?.[2]?.wins || 0}</p><small>Wins</small></div>
                                    <div className="box"><p>{data.top3players?.[2]?.kills || 0}</p><small>Kills</small></div>
                                    <div className="box"><p>{data.top3players?.[2]?.kd || 0}</p><small>K/D</small></div>
                                </div>
                            </div>
                        </div>

                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Player</th>
                                        <th>Points</th>
                                        <th>Wins</th>
                                        <th>Kills</th>
                                        <th>K/D</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { (data.otherPlayers || []).length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                                                {data.top3players.length === 0 ? "No ranked matches recorded yet for this organization." : "No additional players listed."}
                                            </td>
                                        </tr>
                                    ) : (
                                        (data.otherPlayers || []).map((player, i) => (
                                            <tr key={i}>
                                                <td>#{i + 4}</td>
                                                <td className="player_name">
                                                    <div className="dp_t"></div> 
                                                    <p>{player.player_name}</p>
                                                </td>
                                                <td className="points">{player.points}</td>
                                                <td>{player.wins}</td>
                                                <td>{player.kills}</td>
                                                <td>{player.kd}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
};

export default Leaderboard;