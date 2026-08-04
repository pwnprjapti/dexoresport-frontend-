import styles from '../css/Profile.module.css'
import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Nav from "../compo/nav";
import Footer from '../compo/Footer.jsx'
import { SlCalender } from "react-icons/sl";
import { FaTrash } from "react-icons/fa";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const { usr_id } = useParams();
    const [userdata, setUserdata] = useState({});
    const [showBuildModal, setShowBuildModal] = useState(false);
    const navigate = useNavigate();

    const [ teamData, setTeamData ] = useState({
        teamName:"",
        iglName:"", iglUid:"", iglIgn:"",
        assaulterName:"", assaulterUid:"", assaulterIgn:"",
        rusherName:"", rusherUid:"", rusherIgn:"",
        helperName:"", helperUid:"", helperIgn:"",
        substituteName:"", substituteUid:"", substituteIgn:""
    })

 const getuserdata = async () => {
        setLoading(true);
        const token = localStorage.getItem("jwt");
        if (!token) {
            console.error("no token found")
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ usr_id })
            });

            const data = await res.json();
            
            if (res.status === 401) {
                navigate("/login");
                return;
            }
             
            setUserdata(data);
            localStorage.setItem("teams", JSON.stringify(data.user.teams));
        } catch (err) {
            console.error("Error fetching user data:", err);
        } finally {
            setLoading(false);
        }
    }


    const team_handleChange = (e) => {
       const { name, value } = e.target;
       setTeamData((prev)=>({...prev, [name]:value}));
    }

    const createTeam = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt");
        if(!token){
            alert("Please login to continue.");
            navigate("/login");
        }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/createteam`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({teamData})
        });
        if(res.status === 401){
            alert("Your login session have been expired please login to continue.");
            navigate("/login");
        }
        const data = await res.json();
        console.log(data.msg);
    }

    const deleteTeam = async (id) => {
        const token = localStorage.getItem("jwt");
        if(!token){
            alert("Your login session have been expired please login.");
            navigate("/login");
        }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/deleteteam/${id}`, {
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            }
        });

        if(res.ok){
            alert("Team deleted successfully");
            getuserdata();
        } else {
            alert("Failed to delete team")
        }

    }


    const recentMatchesData = [
        { name: "BGMI Summer Showdown", result: "VICTORY", kills: 19, winnings: 3940, date: "May 10, 2026", time: "10:45 PM", map: "Erangel" },
        { name: "Dexor Ultimate Cup", result: "VICTORY", kills: 12, winnings: 1200, date: "May 08, 2026", time: "09:15 PM", map: "Miramar" },
        { name: "BGMI Pro League", result: "DEFEAT", kills: 8, winnings: 0, date: "May 05, 2026", time: "06:30 PM", map: "Sanhok" },
        { name: "Challenger Series", result: "VICTORY", kills: 15, winnings: 2500, date: "May 02, 2026", time: "08:00 PM", map: "Vikendi" }
    ];

    useEffect(() => {
        getuserdata();
    }, []);

    return (
        <>
            <Nav />
            {loading ? (
                <div className={styles.loader_container}>
                    <div className={styles.game_spinner}></div>
                    <p className={styles.loader_text}>LOADING PLAYER PROFILE...</p>
                </div>
            ) : (
                <div className={styles.container}>
                    <h2>Welcome back, <span>{userdata?.user?.name}</span></h2>
                    
                    {/* Restored Box1 */}
                    <div className={styles.box1}>
                        <div className={styles.player_profile}>
                            <div className={styles.dp} style={{ backgroundImage: `url(${userdata?.user?.picture || 'https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780488368/c8d7aXD4SvWCL8_CMb5ZDQ_tmvj49.webp'})` }}></div>
                            <div className={styles.biodata}>
                                <h2>{userdata?.user?.ign || "Gamer"}</h2>
                                <small>UID: {userdata?.user?.uid || "N/A"}</small>
                                <div> 
                                    <p className={styles.joined}><SlCalender /> Joined May 2026</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.recent_info}>
                            <div className={styles.info_box}>
                                <h2>24</h2>
                                <small>Matches Won</small>
                            </div>
                            <div className={styles.info_box}>
                                <h2>89%</h2>
                                <small>Win Rate</small>
                            </div>
                            <div className={styles.info_box}>
                                <h2>$1200</h2>
                                <small>Total Earnings</small>
                            </div>
                            <div className={styles.edit}>
                                <button>EDIT PROFILE</button>
                            </div>
                        </div>
                    </div>

                    {/* Content Section (Box2) */}
                    <div className={styles.box2}>
                        {/* Achievements (achive) */}
                        <div className={`${styles.innr_box} ${styles.achive}`}>
                            <h2>ACHIEVEMENTS</h2>
                            <div className={styles.achive_list}>
                                {(!userdata?.user?.achievements || userdata?.user?.achievements?.length === 0) ? (
                                    <p className={styles.no_data}>no achievement is available right now</p>
                                ) : (
                                    userdata.user.achievements.map((achievement, idx) => {
                                        const pct = achievement?.ttl_no_of_time_must_have > 0 
                                            ? Math.min(100, (achievement?.ttl_no_of_time_have / achievement?.ttl_no_of_time_must_have) * 100) 
                                            : 0;
                                        return (
                                            <div className={styles.achievement} key={idx}>
                                                <div className={styles.achive_logo}>
                                                    <img src={achievement?.src || "https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170431_Gallery_webzfc.jpg"} alt={achievement?.name} />
                                                </div>
                                                <div className={styles.achive_about}>
                                                    <h4>
                                                        {achievement?.name}{' '}
                                                        <span>{achievement?.ttl_no_of_time_have}/{achievement?.ttl_no_of_time_must_have}</span>
                                                    </h4>
                                                    <small>{achievement?.disc || "Win tournaments to unlock"}</small>
                                                    <div className={styles.timeline_container}>
                                                        <div className={styles.timeline} style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <Link to="#">view more achievements</Link>
                            </div>
                        </div>

                        {/* Tournaments (tour) */}
                        <div className={`${styles.innr_box2} ${styles.tour}`}>
                            <h2>YOUR TOURNAMENTS</h2>
                            <div className={styles.table_responsive}>
                                <table className={styles.tour_table}>
                                    <thead>
                                        <tr>
                                            <th>Tournament</th>
                                            <th>Type</th>
                                            <th>Prizepool</th>
                                            <th>Date</th>
                                            <th>Room ID</th>
                                            <th>Room Pass</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!userdata.user?.ttl_matches_joined || userdata.user?.ttl_matches_joined?.length === 0) ? (
                                            <tr className={styles.empty_row}>
                                                <td colSpan="6">
                                                    <div className={styles.empty_state}>
                                                        <p>You have not joined any match yet</p>
                                                        <button onClick={() => navigate("/tournaments")}>Explore tournaments</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            userdata.user.ttl_matches_joined.map((match, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className={styles.tour_info}>
                                                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Tournament" />
                                                            <span>Tournament #{match.tour_id ? (typeof match.tour_id === 'string' ? match.tour_id.slice(-6).toUpperCase() : match.tour_id._id?.slice(-6).toUpperCase() || 'N/A') : 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className={styles.type_badge}>{match.type || 'SQUAD'}</span></td>
                                                    <td><h4 className={styles.wining}>${match.prizepool || '0'}</h4></td>
                                                    <td><small>{match.date ? new Date(match.date).toLocaleDateString() : 'N/A'}</small></td>
                                                    <td><small>{(typeof match.tour_id === 'object' ? match.tour_id?.roomId : '') || 'Shared on TG'}</small></td>
                                                    <td><small>{(typeof match.tour_id === 'object' ? match.tour_id?.roomPassword : '') || 'Shared on TG'}</small></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Your Teams Section */}
                    <div className={styles.your_teams_section}>
                        <div className={styles.section_header}>
                            <h2>YOUR TEAMS</h2>
                            <button className={styles.btn_build_team} onClick={() => setShowBuildModal(true)}>
                                Build team
                            </button>
                        </div>
                        
                        {/* Display exactly one static team as requested by user (no arrays, no objects) */}
                        <div className={styles.teams_list_container}>
                            {userdata?.user?.teams.length === 0 ? (
                                <p className={styles.no_teams}>You have not created Team yet</p>
                            ) : (
                                userdata?.user?.teams.map((team, i)=>(
                                    <div key={i} className={styles.team_card}>
                                        <div className={styles.team_main}>
                                            <div className={styles.team_avatar}>T</div>
                                            <div>
                                                <h3>{team.teamName}</h3>
                                                <p>Leader: {team.igl?.name}</p>
                                            </div>
                                            <button onClick={()=>deleteTeam(team._id)} className={styles.delete_team_btn} title="Delete Team">
                                                <FaTrash />
                                            </button>
                                        </div>
                                        <div className={styles.team_roster}>
                                            <span>IGL: {team.igl?.name || "N/A"}</span>
                                            <span>Assaulter: {team.assaulter?.name || "N/A"}</span>
                                            <span>Rusher: {team.rusher?.name || "N/A"}</span>
                                            <span>Helper: {team.helper?.name || "N/A"}</span>
                                            <span>Substitute: {team.substitute?.name || "N/A"}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className={styles.stats}>
                        <h2>DETAILED STATS</h2>
                        <div className={styles.stat_list}>
                            <div className={styles.stat}>
                                <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486886/Screenshot_20260603_170937_Gallery_v15btp.jpg" alt="K/D" />
                                <small>K/D Ratio</small>
                                <h2>2.45</h2>
                                <small>Top 18%</small>
                            </div>
                            <div className={styles.stat}>
                                <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486902/Screenshot_20260603_171001_Gallery_ifinhr.jpg" alt="Headshot" />
                                <small>Headshot %</small>
                                <h2>20.6%</h2>
                                <small>Top 22%</small>
                            </div>
                            <div className={styles.stat}>
                                <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486902/Screenshot_20260603_171018_Gallery_ac8sbq.jpg" alt="Damage" />
                                <small>Avg. Damage</small>
                                <h2>4566</h2>
                                <small>Top 24%</small>
                            </div>
                            <Link to="">View more</Link>
                        </div>
                    </div>

                    {/* Recent Matches */}
                    <div className={styles.recent_tour}>
                        <h2>Recent Matches</h2>
                        <div className={styles.tour_list}>
                            {recentMatchesData.map((item, idx) => (
                                <div className={styles.match_item} key={idx}>
                                    <div className={`${styles.box} ${styles.img}`}>
                                        <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" alt={item.map} />
                                    </div>
                                    <div className={`${styles.box} ${styles.match_name}`}>
                                        <p>{item.name}</p>
                                        <br />
                                        <small>{item.map}</small>
                                    </div>
                                    <div className={`${styles.box} ${styles.victor_defeat}`}>
                                        <p style={{ 
                                            color: item.result === "VICTORY" ? "#17d717" : "#ff3333", 
                                            textShadow: item.result === "VICTORY" ? "0 0 8px rgba(23, 215, 23, 0.35)" : "0 0 8px rgba(255, 51, 51, 0.35)",
                                            margin: 0
                                        }}>{item.result}</p>
                                    </div>
                                    <div className={`${styles.box} ${styles.kills}`}>
                                        <p>{item.kills}</p>
                                        <br />
                                        <small>Kills</small>
                                    </div>
                                    <div className={`${styles.box} ${styles.winings}`}>
                                        <p style={{ color: item.winnings > 0 ? '#17d717' : '#9c9c9c' }}>
                                            {item.winnings > 0 ? `$${item.winnings}` : '---'}
                                        </p>
                                        <br />
                                        <small>Winnings</small>
                                    </div>
                                    <div className={`${styles.box} ${styles.date_time}`}>
                                        <p>{item.date}</p>
                                        <br />
                                        <small>{item.time}</small>
                                    </div>
                                    <div className={`${styles.box} ${styles.details}`}>
                                        <button>View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="#" className={styles.view_more_link}>View More Matches</Link>
                    </div>
                </div>
            )}
            
            
            {showBuildModal && (
                <div className={styles.modalBackdrop} onClick={() => setShowBuildModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.btnCloseModal} onClick={() => setShowBuildModal(false)}>
                            &times;
                        </button>
                        <h2>Build Your Team</h2>
                        <p className={styles.modalSubtitle}>Fill in the details for all roles to register your esports squad.</p>
                        
                        <form className={styles.teamForm} onSubmit={(e) => { e.preventDefault(); alert("Team created successfully!"); setShowBuildModal(false); }}>
                            <div className={styles.formScrollContainer}>
                                {/* Team Info */}
                                <div className={styles.formSection}>
                                    <h3>Team Name</h3>
                                    <div className={styles.inputGroupRow} style={{ gridTemplateColumns: '1fr' }}>
                                        <input type="text" name="teamName" value={teamData.teamName} onChange={team_handleChange} placeholder="Team Name" required />
                                    </div>
                                </div>

                                {/* IGL Role */}
                                <div className={styles.formSection}>
                                    <h3>IGL (Leader)</h3>
                                    <div className={styles.inputGroupRow}>
                                        <input type="text" name="iglName" value={teamData.iglName} onChange={team_handleChange} placeholder="Player Name" required />
                                        <input type="text" name="iglIgn" value={teamData.iglIgn} placeholder="In-game Name (IGN)" onChange={team_handleChange} required />
                                        <input type="text" name="iglUid" value={teamData.iglUid} placeholder="Player UID" onChange={team_handleChange} required />
                                    </div>
                                </div>

                                {/* Assaulter Role */}
                                <div className={styles.formSection}>
                                    <h3>Assaulter</h3>
                                    <div className={styles.inputGroupRow}>
                                        <input type="text" name="assaulterName" value={teamData.assaulterName} placeholder="Player Name" onChange={team_handleChange} required />
                                        <input type="text" name="assaulterIgn" value={teamData.assaulterIgn} placeholder="In-game Name (IGN)" onChange={team_handleChange} required />
                                        <input type="text" name="assaulterUid" value={teamData.assaulterUid} placeholder="Player UID" onChange={team_handleChange} required />
                                    </div>
                                </div>

                                {/* Rusher Role */}
                                <div className={styles.formSection}>
                                    <h3>Rusher</h3>
                                    <div className={styles.inputGroupRow}>
                                        <input type="text" name="rusherName" value={teamData.rusherName} placeholder="Player Name" onChange={team_handleChange} required />
                                        <input type="text" name="rusherIgn" value={teamData.rusherIgn} placeholder="In-game Name (IGN)" onChange={team_handleChange} required />
                                        <input type="text" name="rusherUid" value={teamData.rusherUid} placeholder="Player UID" onChange={team_handleChange} required />
                                    </div>
                                </div>

                                {/* Helper Role */}
                                <div className={styles.formSection}>
                                    <h3>Helper</h3>
                                    <div className={styles.inputGroupRow}>
                                        <input type="text" name="helperName" value={teamData.helperName} placeholder="Player Name" onChange={team_handleChange} required />
                                        <input type="text" name="helperIgn" value={teamData.helperIgn} placeholder="In-game Name (IGN)" onChange={team_handleChange} required />
                                        <input type="text" name="helperUid" value={teamData.helperUid} placeholder="Player UID" onChange={team_handleChange} required />
                                    </div>
                                </div>

                                {/* Substitute Role */}
                                <div className={styles.formSection}>
                                    <h3>Substitute</h3>
                                    <div className={styles.inputGroupRow}>
                                        <input type="text" name="substituteName" value={teamData.igsubstituteNamelName} placeholder="Player Name" onChange={team_handleChange} required />
                                        <input type="text" name="substituteIgn" value={teamData.substituteIgn} placeholder="In-game Name (IGN)" onChange={team_handleChange} required />
                                        <input type="text" name="substituteUid" value={teamData.substituteUid} placeholder="Player UID" onChange={team_handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" onClick={createTeam} className={styles.btnCreateTeam}>
                                Create Team
                            </button>
                            
                            <div className={styles.formFooterLink}>
                                <a href="#" onClick={(e) => { e.preventDefault(); alert("Redirecting to gamer community..."); }}>
                                    don't have team ? join our community of players
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <Footer />
        </>
    );
}
