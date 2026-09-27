import { useState, useEffect } from "react"
import ControlPanel from "./controlPanel";
import styles from '../css/add_tour.module.css'
import Loading from "./Loading"
import { useNavigate, useParams } from "react-router-dom";

export default function Add_tour(){
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const [details, setDetails] = useState({
         roomId:"",
         roomPassword:"",
         game1:"",
         game2:"",
         tournament_name:"",
         prizepool:"",
         first:"",
         second:"",
         third:"",
         fourth:"",
         map:"",
         team_format:"",
         mode:"",
         tour_start_date:"",
         tour_start_time:"",
         tour_end_date:"",
         tour_end_time:"",
         tour_type:"",
         organization:"",
         regis_end_date:"",
         regis_end_time:"",
         ttl_slots:"",
         disc:"",
         entryfee:"",
         enteries:[],
         stts:"futured",
         match_schedule:"",
         overview:""
    });

    const [rounds, setRounds] = useState([]);

    useEffect(() => {
        if (!id) {
            const timer = setTimeout(() => setLoading(false), 300);
            return () => clearTimeout(timer);
        }

        const getTournament = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tournamentdetails`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ tournament_id: id })
                });

                if (res.status === 401) {
                    navigate("/organizer/login");
                    return;
                }

                if (res.status === 200) {
                    const result = await res.json();
                    if (result && result.tournament) {
                        let parsedRounds = [];
                        if (result.tournament.match_schedule) {
                            try {
                                parsedRounds = JSON.parse(result.tournament.match_schedule);
                                if (!Array.isArray(parsedRounds)) {
                                    parsedRounds = [];
                                }
                            } catch {
                                parsedRounds = [];
                            }
                        }
                        const formattedTournament = {
                            ...result.tournament,
                            stts: result.tournament.stts || "futured",
                            tour_start_date: formatDate(result.tournament.tour_start_date),
                            tour_end_date: formatDate(result.tournament.tour_end_date),
                            regis_end_date: formatDate(result.tournament.regis_end_date)
                        };
                        setDetails(formattedTournament);
                        setRounds(parsedRounds);
                    }
                }
            } catch (err) {
                console.error("Error fetching tournament details:", err);
            } finally {
                setLoading(false);
            }
        };

        getTournament();
    }, [id, navigate]);

    const addRound = () => {
        setRounds(prev => {
            const nextRoundNo = prev.length + 1;
            return [
                ...prev,
                {
                    round_no: nextRoundNo,
                    round_name: "",
                    round_date: "",
                    round_time: ""
                }
            ];
        });
    };

    const removeRound = (indexToRemove) => {
        setRounds(prev => {
            const filtered = prev.filter((_, idx) => idx !== indexToRemove);
            return filtered.map((round, idx) => ({
                ...round,
                round_no: idx + 1
            }));
        });
    };

    const handleRoundChange = (index, field, value) => {
        setRounds(prev => {
            const newRounds = [...prev];
            newRounds[index] = { ...newRounds[index], [field]: value };
            return newRounds;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
         e.preventDefault();

         try {
             const token = localStorage.getItem("jwt");
             const csrfres = await fetch(`${import.meta.env.VITE_BASE_URL}/getcsrf`, { credentials : 'include'});
             const csrfData = await csrfres.json();
             const csrfTokenValue = csrfData?.csrfToken || (typeof csrfData === 'string' ? csrfData : '');

             const finalDetails = {
                 ...details,
                 stts: details.stts || "futured",
                 match_schedule: JSON.stringify(rounds)
             };
          
             if(!id){
                 const res = await fetch(`${import.meta.env.VITE_BASE_URL}/addtournament`,{
                    method:"POST",
                    credentials:'include',
                    headers:{
                        "Content-Type":"application/json",
                        authorization:`Bearer ${token}`,
                        "x-csrf-token": csrfTokenValue
                    },
                    body:JSON.stringify(finalDetails)
                });

                if(res.status === 401) {
                    alert("Your login session has expired, please login to continue");
                    navigate("/organizer/login");
                    return;
                }

                const data = await res.json();
                if(res.ok) {
                    alert(data?.msg?.[0] || "Tournament added successfully");
                    navigate("/organizer/tournaments");
                } else {
                    alert(data?.msg?.[0] || "Failed to add tournament");
                }

             } else {
                 const res = await fetch(`${import.meta.env.VITE_BASE_URL}/edittournament`,{
                    method:"POST",
                    credentials:'include',
                    headers:{
                        "Content-Type":"application/json",
                        authorization:`Bearer ${token}`,
                        "x-csrf-token": csrfTokenValue
                    },
                    body:JSON.stringify({tournament_id:id, data:finalDetails})
                });

                const data = await res.json();
                if(res.ok) {
                    alert(data?.msg || "Tournament updated successfully");
                    navigate("/organizer/tournaments");
                } else {
                    alert(data?.msg || "Failed to edit tournament");
                }
             }
         } catch {
             console.error("Tournament save error");
             alert("An error occurred while saving the tournament.");
         }
    };

    return (
         loading ? <Loading /> : (
         <div className={styles.container}>
            <ControlPanel />
            <div className={styles.box}>
                <input type="text" name="tournament_name" onChange={handleChange} placeholder="Enter Tournament Name" value={details.tournament_name || ""} required />
                <input type="number" name="ttl_slots" onChange={handleChange} onWheel={(e) => e.target.blur()} placeholder="Total Slots" value={details.ttl_slots || ""} required />
                <textarea name="disc" onChange={handleChange} className="discription" placeholder="Give a brief description about tournament" value={details.disc || ""} required/>
                <label>Tournament Start Date</label>
                <input name="tour_start_date" onChange={handleChange} type="date" value={details.tour_start_date || ""} required />
                <label>Tournament Start Time</label>
                <input name="tour_start_time" onChange={handleChange} type="time" value={details.tour_start_time || ""} required/>
                <label>Tournament End Date</label>
                <input name="tour_end_date" onChange={handleChange} type="date" value={details.tour_end_date || ""} required />
                <label>Tournament End Time</label>
                <input name="tour_end_time" onChange={handleChange} type="time" value={details.tour_end_time || ""} required/>
                <input name="organization" onChange={handleChange} type="text" placeholder="Your Organization Name" value={details.organization || ""} required />
                <label>Registration End Date</label>
                <input name="regis_end_date" onChange={handleChange} type="date" value={details.regis_end_date || ""} required/>
                <label>Registration End Time</label>
                <input name="regis_end_time" onChange={handleChange} type="time" value={details.regis_end_time || ""} required />
                <select name="team_format" onChange={handleChange} value={details.team_format || ""} required>
                    <option value="">Team Format</option>
                    <option value="SOLO (1 player)">SOLO (1 player)</option>
                    <option value="Duo(2 players)">Duo(2 players)</option>
                    <option value="SQUAD(4 players)">SQUAD(4 players)</option>
                </select>
                <input name="entryfee" onChange={handleChange} onWheel={(e) => e.target.blur()} type="number" placeholder="Entry Fee" value={details.entryfee || ""} required />
                <input name="map" onChange={handleChange} type="text" placeholder="Enter Map Name (Erangel, Miramar, Sanhok)" value={details.map || ""} required/>
                <select name="mode" onChange={handleChange} value={details.mode || ""} required>
                    <option value="">Mode</option>
                    <option value="fpp">FPP</option>
                    <option value="tpp">TPP</option>
                </select>
                <select name="tour_type" onChange={handleChange} value={details.tour_type || ""} required>
                    <option value="">Tournament Type</option>
                    <option value="classic">CLASSIC</option>
                    <option value="tdm">TDM</option>
                    <option value="wow">WOW</option>
                </select>
                <label>Tournament Status</label>
                <select name="stts" onChange={handleChange} value={details.stts || "futured"} required>
                    <option value="futured">Upcoming / Future</option>
                    <option value="live">Live</option>
                    <option value="past">Past / Completed</option>
                </select>
                <input name="prizepool" onChange={handleChange} onWheel={(e) => e.target.blur()} type="number" placeholder="Total Prizepool" value={details.prizepool || ""} required />
                <input name="first" onChange={handleChange} onWheel={(e) => e.target.blur()} type="number" placeholder="1st Prize" value={details.first || ""} required/>
                <input name="second" onChange={handleChange} onWheel={(e) => e.target.blur()} type="number" placeholder="2nd Prize" value={details.second || ""} required />
                <input name="third" onChange={handleChange} onWheel={(e) => e.target.blur()} type="number" placeholder="3rd Prize" value={details.third || ""} required />
                <input name="fourth" onChange={handleChange} onWheel={(e) => e.target.blur()} type="number" placeholder="4th Prize" value={details.fourth || ""} required/>
                <div className={styles.scheduleSection}>
                    <div className={styles.scheduleHeader}>
                        <h3>Match Schedule</h3>
                        <button type="button" className={styles.addRoundBtn} onClick={addRound}>
                            + Add Round
                        </button>
                    </div>
                    {rounds.length > 0 ? (
                        <div className={styles.roundsList}>
                            {rounds.map((round, idx) => (
                                <div className={styles.roundRow} key={idx}>
                                    <div className={styles.roundField}>
                                        <label>Round No.</label>
                                        <input
                                            type="number"
                                            value={round.round_no}
                                            readOnly
                                            className={styles.readOnlyInput}
                                        />
                                    </div>
                                    <div className={styles.roundField}>
                                        <label>Round Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Group Stage / Finals"
                                            value={round.round_name || ""}
                                            onChange={(e) => handleRoundChange(idx, "round_name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.roundField}>
                                        <label>Round Date</label>
                                        <input
                                            type="date"
                                            value={round.round_date || ""}
                                            onChange={(e) => handleRoundChange(idx, "round_date", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.roundField}>
                                        <label>Round Time</label>
                                        <input
                                            type="time"
                                            value={round.round_time || ""}
                                            onChange={(e) => handleRoundChange(idx, "round_time", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.removeRoundBtn}
                                        onClick={() => removeRound(idx)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noRoundsText}>No rounds added yet. Click "+ Add Round" to schedule matches.</p>
                    )}
                </div>

                <button onClick={handleSubmit}>Create Tournament</button>
            </div>
         </div>
         )
    );
}