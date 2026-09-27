import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ControlPanel from "../compo/controlPanel"
import styles from "../css/participants.module.css"
import Loading from "../compo/Loading"

export default function Participants() {
    const [ slot, setSlot ] = useState();
    const { id } = useParams();
    const [details, setDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedTeamRoster, setSelectedTeamRoster] = useState(null);
    const [roomId, setRoomId] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const navigate = useNavigate();

    // Result submission states
    const [teamRank, setTeamRank] = useState("");
    const [totalPoints, setTotalPoints] = useState("");
    const [playerFinishes, setPlayerFinishes] = useState({
        igl: "",
        assaulter: "",
        rusher: "",
        helper: "",
        substitute: ""
    });
    const [ teamId, setTeamId ] = useState();

    const openRosterModal = (team, idx) => {
        setSelectedTeamRoster(team);
        setSlot(idx + 1);
        setTeamRank(team.result?.rank || "");
        setTotalPoints(team.result?.points || "");
        setPlayerFinishes({
            igl:"",
            assaulter:"",
            rusher:"",
            helper:"",
            substitute:""
        });
    };

    const handleFinishChange = (role, value) => {
        setPlayerFinishes(prev => ({
            ...prev,
            [role]: value
        }));
        console.log(playerFinishes);
    };

    const handleSubmitResult = async () => {
        const totalPoints_ = Number(playerFinishes.igl || 0) + Number(playerFinishes.assaulter || 0) + Number(playerFinishes.rusher || 0)  + Number(playerFinishes.helper || 0) + Number(playerFinishes.substitute || 0) + Number(teamRank || 0) ;
         setTotalPoints(totalPoints_);
        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("Please Login to submit results");
            return;
        }

        const teamResult = {
            tourId:id,
            rank: teamRank,
            points: totalPoints_,
            finishes: playerFinishes,
            teamId:teamId
        };
   
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/submitresult`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization:`Bearer ${token}`
            },
            body:JSON.stringify(teamResult)
        });
        
        if(res.status === 401){
            alert("Your login session have been expired please login to continue..");
            navigate("/organizer/login");
        }
        const result = await res.json();
        console.log(result);
    };

    const getDetails = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("Please Login to continue");
            navigate("/organizer/login");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tournamentdetails`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ tournament_id: id })
            });

            if (res.status === 401) {
                navigate("/organizer/login");
                return;
            }

            const result = await res.json();
            
            setDetails(result);
            setRoomId(result.tournament.roomId);
            setRoomPassword(result.tournament.roomPassword);
        } catch (error) {
            console.error("Error fetching tournament details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDetails();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    // const entries = details?.tournament?.enteries || [];

    const handleSendRoomDetails = async () => {
        if (!roomId || !roomPassword) {
            alert("Please enter both Room ID and Room Password.");
            return;
        }
    
        const token = localStorage.getItem("jwt");
        if(!token){
            alert("Your login session have been expired please login to send room details");
        }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/sendRoomDetails`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization:`Bearer ${token}`
            },
            body:JSON.stringify({roomId, roomPassword, id})
        })

        const result = await res.json();
        alert(result?.msg || `Room ID: ${roomId} and Password: ${roomPassword} sent successfully to all registered players of "${details?.tournament?.tournament_name || 'Tournament'}"!`);

        getDetails();        
    };

    if(!details?.tournament){
        return (<p>{details?.msg || "Tournament not found"}</p>)
    }

    return (
        <>
            <ControlPanel />
            <div className={styles.participantsContainer}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>{details?.tournament.tournament_name || "Tournament Name"}</h1>
                        <p>{details?.tournament.disc || "Tournament Description"}</p>
                    </div>
                </div>

                {/* Room Details Form Area */}
                <div className={styles.roomDetailsForm}>
                    <div className={styles.inputGroup}>
                        <label>Room ID:</label>
                        <input 
                            type="text" 
                            placeholder="Enter Room ID" 
                            value={roomId} 
                            onChange={(e) => setRoomId(e.target.value)} 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Room Password:</label>
                        <input 
                            type="text" 
                            placeholder="Enter Room Password" 
                            value={roomPassword} 
                            onChange={(e) => setRoomPassword(e.target.value)} 
                        />
                    </div>
                    <button className={styles.btnSendDetails} onClick={handleSendRoomDetails}>
                        Send Room Details
                    </button>
                </div>

                {/* Tournament Details Info Card */}
                {details?.tournament && (
                    <div className={styles.tourDetailsCard}>
                        <div className={styles.detailRow}>
                            <div><small>GAME</small><h4>{details?.tournament.game1 || "BGMI"}</h4></div>
                            <div><small>FORMAT</small><h4>{details?.tournament?.team_format || "SQUAD"}</h4></div>
                            <div><small>ENTRY FEE</small><h4 style={{ color: '#ffd700' }}>₹{details?.tournament?.entryfee || "100"}</h4></div>
                            <div><small>PRIZEPOOL</small><h4 style={{ color: '#ffd700' }}>₹{details?.tournament?.prizepool || "3000"}</h4></div>
                            <div><small>START DATE</small><h4>{details?.tournament?.tour_start_date ? new Date(details?.tournament?.tour_start_date).toLocaleDateString() : "-"}</h4></div>
                            <div><small>SLOTS BOOKED</small><h4>{details.tournament?.enteries?.length || 0} / {details?.tournament?.ttl_slots || 100}</h4></div>
                            <div><small>STATUS</small><h4 style={{ color: 'greenyellow' }}>{details?.tournament?.stts || "Live"}</h4></div>
                        </div>
                    </div>
                )}

                {/* Teams List Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.playersTable}>
                        <thead>
                            <tr>
                                <th>Slot No.</th>
                                <th>Team Name</th>
                                <th>Leader Name</th>
                                <th>Leader IGN</th>
                                <th>Leader UID</th>
                                <th>Payment ID</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details?.tournament?.enteries?.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#707385', fontFamily: 'Orbitron' }}>
                                        No team have registered
                                    </td>
                                </tr>
                            ) : (
                                details?.tournament?.enteries.map((team, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <td style={{ color: '#00f0ff', fontFamily: 'Orbitron', fontWeight: 'bold' }}>{idx+1}</td>
                                        <td className={styles.playerName}>
                                            <div className={styles.avatar}>
                                                {team.teamName.charAt(0)}
                                            </div>
                                            <span>{team.teamName}</span>
                                        </td>
                                        <td style={{ color: 'white' }}>{team.igl.name}</td>
                                        <td className={styles.ignText}>{team.igl.ign}</td>
                                        <td className={styles.uidText}>{team.igl.uid}</td>
                                        <td className={styles.paymentIdText}>{team.paymentId}</td>
                                        <td>
                                            <span style={{ color: 'greenyellow', fontWeight: 'bold' }}>{team.paymentStatus}</span>
                                        </td>
                                        <td>
                                            <button 
                                                className={styles.btnView}
                                                onClick={() => openRosterModal(team, idx)}>
                                                View Players
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Roster Popup Modal Display */}
                 {selectedTeamRoster ? console.log(selectedTeamRoster) : console.log("hello")}
                {selectedTeamRoster && (
                    <div className={styles.modalBackdrop} onClick={() => {setSelectedTeamRoster(null); setSlot(null)}}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.btnCloseModal} onClick={() => setSelectedTeamRoster(null)}>
                                &times;
                            </button>
                            <div className={styles.modalHeader}>
                                <h2>
                                    Roster for <span style={{ color: '#00f0ff' }}>{selectedTeamRoster.teamName}</span>
                                </h2>
                                <span className={styles.modalSlot}>Slot No. {slot}</span>
                            </div>
                            <div className={styles.modalBody}>
                                {/* Result Input Row (Rank & Total Points) */}
                                <div className={styles.resultInputRow}>
                                    <div className={styles.resultInputGroup}>
                                        <label>Total Points</label>
                                        <input disabled
                                            type="number"
                                            placeholder="Enter Total Points"
                                            value={totalPoints !== "" ? totalPoints : (selectedTeamRoster.points || "")}
                                            onChange={(e) => setTotalPoints(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.resultInputGroup}>
                                        <label>Team Rank</label>
                                        <input
                                            type="number"
                                            placeholder="Enter Rank"
                                            value={teamRank !== "" ? teamRank : (selectedTeamRoster.rank || "")}
                                            onChange={(e) => setTeamRank(e.target.value)}
                                        />
                                    </div>
                                
                                </div>

                                <div className={styles.modalTableWrapper}>
                                    <h3 className={styles.tableTitle}>Players List</h3>
                                    <table className={styles.rosterTable}>
                                        <thead>
                                            <tr>
                                                <th>Player Name</th>
                                                <th>In-game Name (IGN)</th>
                                                <th>Player UID</th>
                                                <th>Assigned Role</th>
                                                <th>Finishes / Kills</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            
                                          <tr>
                                                <td style={{ color: 'white', fontWeight: '600', padding: '12px 10px' }}>{selectedTeamRoster.igl.name}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.igl.ign}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.igl.uid}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <span className={`${styles.roleTag} ${styles.igl}`}>
                                                       IGl
                                                    </span>
                                                 </td>
                                                 <td>
                                                    <input
                                                        type="number"
                                                        className={styles.finishInput}
                                                        value={selectedTeamRoster.igl.kills}
                                                        onChange={(e) => handleFinishChange("igl", e.target.value || 0)}
                                                        placeholder="0"
                                                    />
                                                </td>
                                          </tr>
                                           <tr>
                                                <td style={{ color: 'white', fontWeight: '600', padding: '12px 10px' }}>{selectedTeamRoster.assaulter.name}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.assaulter.ign}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.assaulter.uid}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <span className={`${styles.roleTag} ${styles.assaulter}`}>
                                                       Assaulter
                                                    </span>
                                                 </td>
                                                 <td>
                                                    <input
                                                        type="number"
                                                        className={styles.finishInput}
                                                        value={selectedTeamRoster.assaulter.kills}
                                                        onChange={(e) => handleFinishChange("assaulter", e.target.value || 0)}
                                                        placeholder="0"
                                                    />
                                                </td>
                                          </tr>
                                           <tr>
                                                <td style={{ color: 'white', fontWeight: '600', padding: '12px 10px' }}>{selectedTeamRoster.rusher.name}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.rusher.ign}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.rusher.uid}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <span className={`${styles.roleTag} ${styles.rusher}`}>
                                                       Rusher
                                                    </span>
                                                 </td>
                                                 <td>
                                                    <input
                                                        type="number"
                                                        className={styles.finishInput}
                                                        value={selectedTeamRoster.rusher.kills}
                                                        onChange={(e) => handleFinishChange("rusher", e.target.value || 0)}
                                                        placeholder="0"
                                                    />
                                                </td>
                                          </tr>
                                           <tr>
                                                <td style={{ color: 'white', fontWeight: '600', padding: '12px 10px' }}>{selectedTeamRoster.helper.name}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.helper.ign}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.helper.uid}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <span className={`${styles.roleTag} ${styles.helper}`}>
                                                       Helper
                                                    </span>
                                                 </td>
                                                 <td>
                                                    <input
                                                        type="number"
                                                        className={styles.finishInput}
                                                        value={selectedTeamRoster.helper.kills}
                                                        onChange={(e) => handleFinishChange("helper", e.target.value || 0)}
                                                        placeholder="0"
                                                    />
                                                </td>
                                          </tr>
                                           <tr>
                                                <td style={{ color: 'white', fontWeight: '600', padding: '12px 10px' }}>{selectedTeamRoster.substitute.name}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.substitute.ign}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#d1d4e5', padding: '12px 10px' }}>{selectedTeamRoster.substitute.uid}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <span className={`${styles.roleTag} ${styles.substitute}`}>
                                                       Substitute
                                                    </span>
                                                 </td>
                                                 <td>
                                                    <input
                                                        type="number"
                                                        className={styles.finishInput}
                                                        value={selectedTeamRoster.substitute.kills}
                                                        onChange={(e) => handleFinishChange("substitute", e.target.value || 0)}
                                                        placeholder="0"
                                                    />
                                                </td>
                                          </tr>
                                                
                                        </tbody>
                                    </table>
                                </div>

                                 {/* View Submitted POV */}
                                <button 
                                    className={styles.btnSubmitResult}
                                    style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 119, 255, 0.5))', border: '1px solid #00f0ff', color: '#fff', marginRight: '10px' }}
                                    onClick={() => navigate(`/organizer/pov/${id || 'DX-TOUR-892'}/${selectedTeamRoster._id || selectedTeamRoster.paymentId || 'TM-SOUL-104'}`)}
                                >
                                    🎥 View Submitted POV (5 Players)
                                </button>

                                {/* Submit Result Button */}
                                <button className={styles.btnSubmitResult} onClick={()=> { setTeamId(selectedTeamRoster._id); handleSubmitResult()}}>
                                    Submit Result
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
