import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Nav from '../compo/nav';
import Loading from '../compo/Loading';
import EndTimer from '../compo/EndTimer';
import "../css/tour_join.css"
import { FaMap } from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";
import { IoMedal } from "react-icons/io5";
import { CiMedal } from "react-icons/ci";
import { GiSportMedal } from "react-icons/gi";
import { IoDiamondSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router-dom"
import TournamentPaymentModal from '../compo/TournamentPaymentModal';

const formatDateShort = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
};

const formatTime12Hr = (timeString) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    if (parts.length < 2) return timeString;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
};

export default function Tournament_join(){
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const [ teams, setTeams ] = useState([]);
    const [ tournament, setTournament ] = useState({});
    const [ isRegistered ,setIsRegistered ] = useState();
    const [ showJoinModal, setShowJoinModal ] = useState(false);
    const [ hasTeam, setHasTeam ] = useState(true);
    const [ paymentData, setPaymentData ] = useState(null);
    const [ showPaymentModal, setShowPaymentModal ] = useState(false);

    const { id } = useParams();

    const getTournament = async () => {
       try{
        setLoading(true);
        const token = localStorage.getItem("jwt");
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tournament_details`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({id})
        });
        const data = await res.json();

        if(res.status === 401){
            navigate("/login");
        }

        setTournament(data.tournament);
        setIsRegistered(res.status);
        try {
            const stored = JSON.parse(localStorage.getItem("teams"));
            setTeams(Array.isArray(stored) ? stored : []);
        } catch {
            setTeams([]);
        }
        setLoading(false);
       }catch(err){
        console.error("Error fetching tournament:", err);
        setLoading(false);
       }
    }


    useEffect(()=>{
        getTournament();
    }, []);

    const tour_join = async (team) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("jwt");
            if(!token){
                alert("Please login to continue");
                navigate("/login");
                setLoading(false);
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/create-order`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${token}`
                },
                body:JSON.stringify({ tournamentId: id, team })
            });

            const data = await res.json();

            if(res.status === 401){
                alert("Please login to continue");
                navigate("/login");
                setLoading(false);
                return;
            } 
            
            if(res.status === 422){
                setIsRegistered(422);
                alert(data.error || data.message || "Team is already registered for this tournament.");
                setLoading(false);
                return;
            }

            if(!res.ok){
                alert(data.error || data.message || "Registration failed. Please contact the tournament organizer.");
                setLoading(false);
                return;
            }

            // Free Tournament
            if(data.isFree){
                setIsRegistered(422);
                alert("Tournament registration successful ✓");
                getTournament();
                setLoading(false);
                return;
            }

            // Paid Tournament -> Show Organizer's Dynamic UPI QR Payment Modal
            setPaymentData(data);
            setShowPaymentModal(true);
            setLoading(false);

        } catch(err) {
            console.error("Tournament join error:", err);
            alert("Network connection error. Please try again.");
            setLoading(false);
        }
    }


   const [ btm_btn_visible, setBtm_btn_visible ] = useState(false);
   useEffect(()=>{
       function btm_btn_visibility(){
        if(window.scrollY > 300){
            setBtm_btn_visible(true);
        } else {
            setBtm_btn_visible(false);
        }
       };

       window.addEventListener('scroll', btm_btn_visibility);

       return () => {
        window.removeEventListener('scroll', btm_btn_visibility);
       };
   }, []);

    return (
        <>
        { loading ? (
            <Loading />
        ) : (
          <>
           <Nav />
         <div className='box'>
            <div className='poster'>
                <img src='https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780371407/7f2fd805b3300988ed62b2df0ece536ac53a054717947090d0f73bade54f7ec3_lfwy2x.png' alt="match poster" />
                <h2>{tournament.tournament_name}</h2>
                <p className='brief'>geyfhfyuu hkkhiu jk{tournament.disc}</p>
                <div className='poster_cards'>
                    <div className='card'>
                        28 may 2024
                    </div>
                    <div className='card'>
                        07:00 PM IST
                    </div>
                    <div className='card'>
                        {Array.isArray(tournament.enteries) ? tournament.enteries.length : 0}/{tournament.ttl_slots || ''} Teams
                    </div>
                </div>
               
                <div className='btns'>
                    <button className={ isRegistered === 422 ? 'disabled' : 'enabled'} disabled={isRegistered === 422 ? true : false} onClick={() => setShowJoinModal(true)}>{ isRegistered === 422 ? "Registered ✓" : "Join Now" }</button>
                    <button>Share </button>
                </div>

                 {/* <p className='organization'>Organized by <span>HunterX esport</span></p> */}
            </div>
            <p className='organization'>Organized by <span>{tournament.organization || 'Verified Organizer'}</span></p>

            <EndTimer endDate={tournament.regis_end_date} endTime={tournament.regis_end_time} />

            <div className='part1'>
                <div className='box1'>
                     <div className='innr'>
                        <h3>Tournament overview</h3>
                        <p>{tournament.disc || "Battle royale tournament where the best squads compete for glory, exciting prizes and the champion title."}</p>
                        <div className='cards'>
                            <div className='card'>
                                <p>Team Format <br /><span>{tournament.team_format || tournament.Team_size || "Squad"}</span></p>
                            </div>
                            <div className='card'>
                                <p>Entry Fee <br /><span>{Number(tournament.entryfee) > 0 ? `₹${tournament.entryfee}/team` : 'Free Entry'}</span></p>
                            </div>
                            <div className='card'>
                                <FaMap /><p>Map <br /><span>{tournament.map || "Erangel"}</span></p>
                            </div>
                            <div className='card'>
                                <p>Mode <br /><span>{tournament.mode || "TPP"}</span></p>
                            </div>
                        </div>
                     </div>
                     <div className='innr2'>
                        <h3>Tournament Details</h3>
                       <div className='box'>
                        <div className='details'>
                            <p>Tournament Type    <br /><span>{tournament.tour_type || "Battle Royale"}</span></p>
                            <p>Team Size    <br /><span>{tournament.team_format || tournament.Team_size || "Squad"}</span></p>
                            <p>Entry Fee    <br /><span>{Number(tournament.entryfee) > 0 ? `₹${tournament.entryfee}/Team` : 'Free Entry'}</span></p>
                            <p>Max Teams    <br /><span>{tournament.ttl_slots}</span></p>
                            <p>Region     <br /><span>India</span></p>
                            {/* <p>Organized By   <br /><span>HUnerx esport</span></p> */}
                        </div>
                        <div className='details details2'>
                            <p><SlCalender /> Registeration Start  <br /><span>12 May, 2024 - 12:00 PM IST</span></p>
                            <p><SlCalender /> Registeration End   <br /><span>13 May, 2024 - 12:00 PM IST</span></p>
                            <p><SlCalender /> Tournament Start   <br /><span>25 May, 2024 - 12:00 PM IST</span></p>
                            <p><SlCalender /> Tournament End   <br /> <span>25 May, 2024 - 12:00 PM IST</span></p>
                            <p>Contact   <br /><span>support@ghunterx.com</span></p>
                        </div>
                       </div>
                     </div>
                </div>
                <div className='box2'>
                    <div className='innr'>
                        <h3><IoDiamondSharp /> Prize Pool</h3>
                        <div className='prizepool'><p>${tournament.prizepool} </p><br /> <span><p>Total Prize Pool</p></span></div>
                        <p><FaMedal /> 1st Prize   <span>${tournament.first}</span></p>
                        <p><IoMedal /> 2nd Prize   <span>${tournament.second}</span></p>
                        <p><CiMedal /> 3rd Prize   <span>${tournament.third}</span></p>
                        <p><GiSportMedal /> 4th Prize   <span>${tournament.fourth}</span></p>
                    </div>
                    <div className='innr2'>
                        <h2>Rules And Regulations</h2>
                        <li>All matches will be played in Tpp mode.</li>
                        <li>Teams must check in 30 min. before match start.</li>
                        <li>Use of Emulator & hacks is strickly prohibited.</li>
                        <li>organizer,s decions is final decions.</li>
                        <button>View Full RuleBook</button>
                    </div>
                </div>
            </div>

            <div className='part2'>
                <div className='box'>
                    <h3>Match Schedule</h3>
                    <div className='timeline'>
                        {(() => {
                            let parsedSchedule = [];
                            if (tournament.match_schedule) {
                                try {
                                    parsedSchedule = JSON.parse(tournament.match_schedule);
                                    if (!Array.isArray(parsedSchedule)) {
                                        parsedSchedule = [];
                                    }
                                } catch {
                                    parsedSchedule = [];
                                }
                            }
                            
                            if (parsedSchedule.length > 0) {
                                return parsedSchedule.map((round, idx) => (
                                    <div className='content' key={idx}>
                                        <div className='circle'></div>
                                        <div className='line'>
                                            {formatDateShort(round.round_date)} <span>{formatTime12Hr(round.round_time)}</span> Round {round.round_no} - {round.round_name}
                                        </div>
                                    </div>
                                ));
                            } else if (tournament.match_schedule) {
                                return (
                                    <div className='content'>
                                        <div className='circle'></div>
                                        <div className='line' style={{ whiteSpace: 'pre-line' }}>
                                            {tournament.match_schedule}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <p style={{ color: '#a0a3b5', fontSize: '13px', padding: '10px 0' }}>
                                        No schedule announced yet.
                                    </p>
                                );
                            }
                        })()}
                    </div>
                </div>
                {/* <div className='box'></div> */}
            </div>
           { btm_btn_visible && (
             <button className={ isRegistered === 422 ? 'bottom_btn disabled' : 'bottom_btn enabled'} disabled={isRegistered === 422 ? true : false} onClick={() => setShowJoinModal(true)}>{ isRegistered === 422 ? "Registered ✓" : "Join Now"}</button>
           )}
           
           {showJoinModal && (
                <div className="modal-backdrop" onClick={() => setShowJoinModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowJoinModal(false)}>
                            &times;
                        </button>
                        
                        {hasTeam ?  (
                            <>
                                <h2>Select Your Team</h2>
                                <p className="modal-subtitle">Choose your team register for this tournament.</p>
                                
                            {(!teams || teams.length === 0) ? <p>You have not created your team.</p> : teams.map((team, i)=>(
                                    
                                <div key={i} className="team-card">
                                    <div className="team-info">
                                        <span className="team-avatar">T</span>
                                        <div>
                                            <h3>{team.teamName}</h3>
                                            <p>{team.igl.name}</p>
                                        </div>
                                    </div>
                                    <button className="select-btn" onClick={() => { setShowJoinModal(false); tour_join(team); }}>
                                        Select & Register
                                    </button>
                                </div>

                            ))}
                                
                                <div className="modal-footer">
                                    <button className="text-btn" onClick={() => setHasTeam(false)}>
                                         Create or find Team
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>No Team Found</h2>
                                <p className="modal-subtitle">You haven't created or joined any team yet. Choose an option to proceed:</p>
                                
                                <div className="options-container">
                                    <button className="option-btn invite-btn" onClick={() => { alert("Invite link copied to clipboard!"); setShowJoinModal(false); }}>
                                        Invite your teammates
                                    </button>
                                    <button className="option-btn random-btn" onClick={() => { alert("Searching for random teammates..."); setShowJoinModal(false); }}>
                                        Team up with random players
                                    </button>
                                </div>
                                
                                <div className="modal-footer">
                                    <button className="text-btn" onClick={() => setHasTeam(true)}>
                                        Back to your teams
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
           )}

           {/* Organizer UPI Payment QR Modal */}
           {showPaymentModal && paymentData && (
                <TournamentPaymentModal
                    paymentData={paymentData}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        setIsRegistered(422);
                        getTournament();
                    }}
                />
           )}
        </div>
          </>
      )  
        }
        </>
    )
}