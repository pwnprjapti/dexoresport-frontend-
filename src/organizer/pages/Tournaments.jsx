import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../css/tournaments.module.css'
import ControlPanel from '../compo/controlPanel'
import Loading from '../compo/Loading'
import { useGET } from "../hooks/useGET.js"


export default function Tournaments() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [ data, setData ] = useState();
    const { status, data: postData } = useGET("orgTournaments");
     
    useEffect(() => {
        if (postData) {
            setData(postData);
        }
    }, [postData]);

    useEffect(() => {
        if(status === 401){
            navigate("/organizer/login");
        }
    }, [status, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return(
        <>
        <ControlPanel />
         <div className={styles.tournaments}>
                    <div className={styles.create_tournament}>
                        <h3>My Tournaments</h3>
                        <button onClick={()=>navigate("/organizer/addtournament")}>Create Tournament</button>
                    </div>
                     <div className={styles.links}>
                        <Link to="#">All (30)</Link>
                        <Link to="#">Upcoming (12)</Link>
                        <Link to="#">Live (2)</Link>
                        <Link to="#">Completed (14)</Link>
                        <Link to="#">Cancelled (2)</Link>
                     </div>

                     <div className={styles.list}>
                        
                     { !data || !data.tournaments ||data.tournaments.length === 0 ? <p>You have not hosted any tournament yet</p> : data.tournaments.map((tour, i)=>
                       (
                        <div key={tour._id || i} className={styles.tour}>
                            <div className={styles.img} style={{"backgroundImage":"url('https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780832620/6988fb0778e72_bgmi-tournament_pxz3da.png')"}}></div>
                            <div className={styles.detail}>
                                <h3>{tour.tournament_name}</h3>
                                <div className={styles.labels}>
                                    <div className={styles.label}>{tour.team_format}</div>
                                    <div className={styles.label}>{tour.enteries?.length || 0}/{tour.ttl_slots} Teams</div>
                                    <div className={styles.label}>{tour.tour_start_date}</div>
                                </div>
                                <div className={styles.inr_detail}>
                                    <div className={styles.box}>
                                        <small>Entry Fee</small>
                                        <h4>₹{tour.entryfee}</h4>
                                    </div>
                                    <div className={styles.box}>
                                        <small>Prizepool</small>
                                        <h4>₹{tour.prizepool}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.action}>
                                <div className={styles.box}>
                                    <small>Maps</small>
                                    <p style={{"color":"greenyellow"}}>{tour.map}</p>
                                    <small>Status</small>
                                    <p style={{"color":"greenyellow"}}>{tour.stts} upcoming</p>
                                </div>
                                <div className={styles.btnGroup}>
                                    <button onClick={() => navigate(`/organizer/view/${tour._id}`)}>View Details</button>
                                    <button className={styles.btnEdit} onClick={() => navigate(`/organizer/edit/${tour._id}`)}>Edit</button>
                                </div>
                            </div>
                        </div>
                     ))}

                        {/* <div className={styles.tour}>
                            <div className={styles.img} style={{"backgroundImage":"url('https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780832620/6988fb0778e72_bgmi-tournament_pxz3da.png')"}}></div>
                            <div className={styles.detail}>
                                <h3>Challengers Cup TDM</h3>
                                <div className={styles.labels}>
                                    <div className={styles.label}>Squad</div>
                                    <div className={styles.label}>16/16 Teams</div>
                                    <div className={styles.label}>May 28, 2026</div>
                                </div>
                                <div className={styles.inr_detail}>
                                    <div className={styles.box}>
                                        <small>Entry Fee</small>
                                        <h4>₹100</h4>
                                    </div>
                                    <div className={styles.box}>
                                        <small>Prizepool</small>
                                        <h4>₹1500</h4>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.action}>
                                <div className={styles.box}>
                                    <small>Registeration</small>
                                    <p style={{"color":"greenyellow"}}>Full</p>
                                    <small>Status</small>
                                    <p style={{"color":"greenyellow"}}>Live</p>
                                </div>
                                <div className={styles.btnGroup}>
                                    <button>View Details</button>
                                    <button className={styles.btnEdit} onClick={() => navigate("/organizer/addtournament")}>Edit</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tour}>
                            <div className={styles.img} style={{"backgroundImage":"url('https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780832620/6988fb0778e72_bgmi-tournament_pxz3da.png')"}}></div>
                            <div className={styles.detail}>
                                <h3>Sunday Showdown Classic</h3>
                                <div className={styles.labels}>
                                    <div className={styles.label}>Squad</div>
                                    <div className={styles.label}>24/50 Teams</div>
                                    <div className={styles.label}>May 30, 2026</div>
                                </div>
                                <div className={styles.inr_detail}>
                                    <div className={styles.box}>
                                        <small>Entry Fee</small>
                                        <h4>₹100</h4>
                                    </div>
                                    <div className={styles.box}>
                                        <small>Prizepool</small>
                                        <h4>₹5000</h4>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.action}>
                                <div className={styles.box}>
                                    <small>Registeration</small>
                                    <p style={{"color":"yellow"}}>Open</p>
                                    <small>Status</small>
                                    <p style={{"color":"cyan"}}>Upcoming</p>
                                </div>
                                <div className={styles.btnGroup}>
                                    <button>View Details</button>
                                    <button className={styles.btnEdit} onClick={() => navigate("/organizer/addtournament")}>Edit</button>
                                </div>
                            </div>
                        </div> */}
                        
                     </div>
                  </div>
        </>
    )
}