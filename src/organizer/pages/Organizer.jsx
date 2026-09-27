import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "../css/organizer.css"
import { Link } from "react-router-dom"
import ControlPanel from "../compo/controlPanel";
import Loading from "../compo/Loading";
import OrganizerPaymentGateway from "../compo/OrganizerPaymentGateway";

export default function Admin(){
    const navigate = useNavigate();
    const [OrgData, setOrgData] = useState({});
    const [loading, setLoading] = useState(true);

    const getOrgData = async () => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            navigate("/organizer/login");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                navigate("/organizer/login");
                return;
            }

            const data = await res.json();
            setOrgData(data || {});
            setLoading(false);
        } catch (err) {
            console.error("Error loading organizer profile:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrgData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <ControlPanel />

            <div className="organiser_page_container">
                <div className="organiser_inner_container">
                    <h2 className="welcome_back_title">Welcome back, <span>{OrgData.name || 'Organizer'}</span></h2>

                    {OrgData.slug && (
                        <div style={{
                            background: "linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(112, 0, 255, 0.15))",
                            border: "1px solid rgba(0, 240, 255, 0.35)",
                            borderRadius: "14px",
                            padding: "16px 20px",
                            marginBottom: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "14px"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div>
                                    <div style={{ fontSize: "12px", color: "#00ff59", fontWeight: "700", textTransform: "uppercase", marginBottom: "4px" }}>
                                        ● Your Branded Player Website is Live
                                    </div>
                                    <div style={{ color: "#00f0ff", fontWeight: "700", fontSize: "15px", fontFamily: "monospace" }}>
                                        {window.location.hostname.includes("localhost") 
                                            ? `http://${OrgData.slug}.localhost:${window.location.port}`
                                            : `https://${OrgData.slug}.${window.location.hostname.split(".").slice(-2).join(".")}`}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button 
                                    onClick={() => {
                                        const url = window.location.hostname.includes("localhost") 
                                            ? `http://${OrgData.slug}.localhost:${window.location.port}`
                                            : `https://${OrgData.slug}.${window.location.hostname.split(".").slice(-2).join(".")}`;
                                        navigator.clipboard.writeText(url);
                                        alert("Website URL copied to clipboard!");
                                    }}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.08)",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        color: "#fff",
                                        padding: "8px 14px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: "600"
                                    }}
                                >
                                    Copy URL
                                </button>

                                <a 
                                    href={window.location.hostname.includes("localhost") 
                                        ? `http://${OrgData.slug}.localhost:${window.location.port}`
                                        : `https://${OrgData.slug}.${window.location.hostname.split(".").slice(-2).join(".")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        background: "linear-gradient(135deg, #00f0ff, #0077ff)",
                                        color: "#050914",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        textDecoration: "none",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    Visit Website ↗
                                </a>
                            </div>
                        </div>
                    )}

            <div className="sec1">
                <div className="organiser_dp"><div className="profile_pic"></div></div>
                <div className="info"><h1>{OrgData.organizationName}</h1><p>{OrgData.about}</p></div>
                <div className="box">
                    <div className="social_media" onClick={()=>window.location.href = OrgData.youtube_channel}>YouTube</div>
                    <div className="social_media" onClick={()=>window.location.href = OrgData.whatsapp_group}>WhatsApp</div>
                    <div className="social_media" onClick={()=>window.location.href = OrgData.discord}>Discord</div>
                    <div className="social_media" onClick={()=>window.location.href = OrgData.instagram}>Instagram</div>
                </div>
            </div>

            <div className="sec2">

                <div className="box">

                   <div className="cards">
                     <div className="card"><small>Tournaments Hosted</small><h1>24</h1><small>Total</small></div>
                     <div className="card"><small>Total Players</small><h1>12.4</h1><small>Total</small></div>
                     <div className="card"><small>Total Prizepool</small><h1>₹5674</h1><small>Total</small></div>
                     <div className="card"><small>Average Rating</small><h1>4.2</h1><small>Out of 5</small></div>
                   </div>
                   
                   <div className="tournaments">
                    <div className="create_tournament">
                        <h3>My Tournaments</h3>
                        <button onClick={()=>navigate("/organizer/addtournament")}>Create Tournament</button>
                    </div>
                     <div className="links">
                        <Link>All (30)</Link>
                        <Link>Upcoming (12)</Link>
                        <Link>Live (2)</Link>
                        <Link>Completed (14)</Link>
                        <Link>Cancelled (2)</Link>
                     </div>

                     <div className="list">
                        
                        <div className="tour">
                            <div className="img" style={{"backgroundImage":"url('https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780832620/6988fb0778e72_bgmi-tournament_pxz3da.png')"}}></div>
                            <div className="detail">
                                <h3>TOurnamnet Name</h3>
                                <div className="labels">
                                    <div className="label">Squad</div>
                                    <div className="label">100/100 Teams</div>
                                    <div className="label">May 26, 2026</div>
                                </div>
                                <div className="inr_detail">
                                    <div className="box">
                                        <small>Entry Fee</small>
                                        <h4>₹100</h4>
                                    </div>
                                    <div className="box">
                                        <small>Prizepool</small>
                                        <h4>₹3000</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="action">
                                <div className="box">
                                    <small>Registeration</small>
                                    <p style={{"color":"greenyellow"}}>Full</p>
                                    <small>Status</small>
                                    <p style={{"color":"greenyellow"}}>Live</p>
                                </div>
                                  <button>View Details</button>
                            </div>
                        </div>

                        <div className="tour">
                            <div className="img" style={{"backgroundImage":"url('https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780371407/7f2fd805b3300988ed62b2df0ece536ac53a054717947090d0f73bade54f7ec3_lfwy2x.png')"}}></div>
                            <div className="detail">
                                <h3>TOurnamnet Name</h3>
                                <div className="labels">
                                    <div className="label">Squad</div>
                                    <div className="label">100/100 Teams</div>
                                    <div className="label">May 26, 2026</div>
                                </div>
                                <div className="inr_detail">
                                    <div className="box">
                                        <small>Entry Fee</small>
                                        <h4>₹100</h4>
                                    </div>
                                    <div className="box">
                                        <small>Prizepool</small>
                                        <h4>₹3000</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="action">
                                <div className="box">
                                    <small>Registeration</small>
                                    <p style={{"color":"greenyellow"}}>Full</p>
                                    <small>Status</small>
                                    <p style={{"color":"greenyellow"}}>Live</p>
                                </div>
                                  <button>View Details</button>
                            </div>
                        </div>

                        <div className="tour">
                            <div className="img" style={{"backgroundImage":"url('https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780832620/6988fb0778e72_bgmi-tournament_pxz3da.png')"}}></div>
                            <div className="detail">
                                <h3>Tournamnet Name</h3>
                                <div className="labels">
                                    <div className="label">Squad</div>
                                    <div className="label">100/100 Teams</div>
                                    <div className="label">May 26, 2026</div>
                                </div>
                                <div className="inr_detail">
                                    <div className="box">
                                        <small>Entry Fee</small>
                                        <h4>₹100</h4>
                                    </div>
                                    <div className="box">
                                        <small>Prizepool</small>
                                        <h4>₹3000</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="action">
                                <div className="box">
                                    <small>Registeration</small>
                                    <p style={{"color":"greenyellow"}}>Full</p>
                                    <small>Status</small>
                                    <p style={{"color":"greenyellow"}}>Live</p>
                                </div>
                                  <button>View Details</button>
                            </div>
                        </div>

                        <div className="tour">
                            <div className="img" style={{"backgroundImage":"url('https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780371407/7f2fd805b3300988ed62b2df0ece536ac53a054717947090d0f73bade54f7ec3_lfwy2x.png')"}}></div>
                            <div className="detail">
                                <h3>TOurnamnet Name</h3>
                                <div className="labels">
                                    <div className="label">Squad</div>
                                    <div className="label">100/100 Teams</div>
                                    <div className="label">May 26, 2026</div>
                                </div>
                                <div className="inr_detail">
                                    <div className="box">
                                        <small>Entry Fee</small>
                                        <h4>₹100</h4>
                                    </div>
                                    <div className="box">
                                        <small>Prizepool</small>
                                        <h4>₹3000</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="action">
                                <div className="box">
                                    <small>Registeration</small>
                                    <p style={{"color":"greenyellow"}}>Full</p>
                                    <small>Status</small>
                                    <p style={{"color":"greenyellow"}}>Live</p>
                                </div>
                                  <button>View Details</button>
                            </div>
                        </div>
                        
                     </div>
                   </div>
                </div>
                <div style={{ marginTop: '30px', width: '100%' }}>
                    <OrganizerPaymentGateway />
                </div>
            </div>
        </div>
     </div>
     </>
    )
}