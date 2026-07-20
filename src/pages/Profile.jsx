import styles from '../css/Profile.module.css'
import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Nav from "../compo/nav";
import Tournament_join from "./Tournament_join";

import { SlCalender } from "react-icons/sl";

export default function Profile() {
    const [ loading, setLoading ] = useState();
     const { usr_id } = useParams();
     const [userdata, setUserdata] = useState({})

     const getuserdata = async () => {
        setLoading(true);
        const token = localStorage.getItem("jwt");
        // console.log(token)
        if(!token){
            console.error("no token found")
            navigate("/login");
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:` Bearer ${token}`
            },
            body:JSON.stringify({usr_id})
        })

        const data = await res.json();
        console.log(data);
        
        if(res.status === 401){
            navigate("/login");
        }

        setUserdata(data);

        setLoading(false);
     }
 
       useEffect(()=>{
        getuserdata();
       }, [])


     const navigate = useNavigate();
    //  const [future, setFuture ] = useState([]);
    //  const [live, setLive ] = useState([]);
    //  const [past, setPast ] = useState([]);

    //  const getTournaments = async () => {
    //    try{
    //     const res_future = await fetch("http://localhost:3000/future");
    //     const res_live = await fetch("http://localhost:3000/live");
    //     const res_past = await fetch("http://localhost:3000/past");

    //     const future = await res_future.json();
    //     const live = await res_live.json();
    //     const past = await res_past.json();

    //     setFuture(future);
    //     setLive(live);
    //     setPast(past);

    //    }catch(err){
    //     console.log(err);
    //    }
    // }

    // useEffect(()=>{
    //     getTournaments();
    // }, [])

    return (
         loading ? <p>loading please wait </p> : (
              <>
              <Nav />
            <div className={styles.container}>
                <h2>Welcome back, {userdata?.user?.name}</h2>
                <div className={styles.box1}>
                    <div className={styles.player_profile}>
                        <div className={styles.dp}></div>
                        <div className={styles.biodata}>
                            <h2>{userdata?.user?.ign}</h2>
                            <small>UID: {userdata?.user?.uid}</small>
                            <div> <p className={styles.joined}><SlCalender /> Joined May 2026</p></div>
                        </div>
                    </div>
                    <div className={styles.recent_info}>
                        {/* <div className={styles.info_box}><p>23</p><small>Tournament Played</small></div> */}
                        <div className={styles.info_box}><h2>24</h2><small>Matches Won</small></div>
                        <div className={styles.info_box}><h2>89%</h2><small>Win Rate</small></div>
                        <div className={styles.info_box}><h2>$1200</h2><small>Total Earnings</small></div>
                        <div className={styles.edit}><button>EDIT PROFILE</button></div>
                    </div>
                </div>

                <div className={styles.box2}>
                    <div className={`${styles.innr_box} ${styles.achive}`}>
                        {/* <h2>ACHIEVEMENTS</h2> */}
                        <div className={styles.achive_list}>
                         { userdata?.user?.achievements?.length === 0 ? <p>no achievent is available right now </p> : userdata.user?.achievements?.map((achievement)=>(
                            //    console.log(achievement)
                               <> 
                            <div className={styles.achievement}>
                            <div className={styles.achive_logo}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170431_Gallery_webzfc.jpg" /></div>
                            <div className={styles.achive_about}>
                                <h4>{achievement?.name} <span>{achievement?.ttl_no_of_time_have}/{achievement?.ttl_no_of_time_must_have}</span></h4>
                                <small>Win 10 tournaments</small><div className='timeline'></div>
                            </div>
                          </div>
                            </>
                         ))}

                          {/* <div className={styles.achievement}>
                            <div className={styles.achive_logo}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170638_Gallery_sn5c14.jpg" /></div>
                            <div className={styles.achive_about}>
                                <h4>Unstoppable <span>15/15</span></h4>
                                <small>Win 15 matches in a row</small><div className='timeline'></div>
                            </div>
                          </div>
                          <div className={styles.achievement}>
                            <div className={styles.achive_logo}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170408_Gallery_zvk82j.jpg" /></div>
                            <div className={styles.achive_about}>
                                <h4>Sharp Shooter <span>100/100</span></h4>
                                <small>Get 100 headshots</small><div className='timeline'></div>
                            </div>
                          </div> */}
                          {/* <div className={styles.achievement}>
                            <div className={styles.achive_logo}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170747_Gallery_b09har.jpg" /></div>
                            <div className={styles.achive_about}>
                                <h4>Early Bird <span>100%</span></h4>
                                <small>Participate in an early bird tournament</small><div className='timeline'></div>
                            </div>
                          </div> */}

                          <Link to="#">view more achievements</Link>
                        </div>
                    </div>
                    <div className={`${styles.innr_box2} ${styles.tour}`}>
                        <h2>YOUR TOURNAMENTS</h2>
                        <table className={styles.tour_table}>
                            <thead>
                                <tr>
                                    <th>Tournament</th>
                                    <th>Type</th>
                                    <th>Prizepool</th>
                                    <th>Date</th>
                                    <th>Id, pass</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                 userdata.user?.ttl_matches_joined?.length === 0 ? <p>You have not joined any match yet <br /> <button onClick={navigate("/tournaments")}>Explore tournaments</button></p> : 
                                 userdata.user?.ttl_matches_joined.map((match)=>(
                                    <>
                                   <tr>
                                    <td>
                                        <div className={styles.tour_info}>
                                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Tournament" />
                                            <span></span>
                                        </div>
                                    </td>
                                    <td><span className={styles.type_badge}>SQUAD</span></td>
                                    <td><h4 className={styles.wining}>$1000</h4></td>
                                    <td><small>May 20, 2026</small></td>
                                    <td><small>32432, 231j</small></td>
                                </tr>
                                </>
                                 ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.stats}>
                    <h2>DETAILED STATS</h2>
                    <div className={styles.stat_list}>
                        <div className={styles.stat}>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486886/Screenshot_20260603_170937_Gallery_v15btp.jpg"></img>
                            <small>K/D Ratio</small>
                            <h2>2.45</h2>
                            <small>Top 18%</small>
                        </div>
                        <div className={styles.stat}>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486902/Screenshot_20260603_171001_Gallery_ifinhr.jpg"></img>
                            <small>Headshot %</small>
                            <h2>20.6%</h2>
                            <small>Top 22%</small>
                        </div>
                        <div className={styles.stat}>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486902/Screenshot_20260603_171018_Gallery_ac8sbq.jpg"></img>
                            <small>Avg. Damage</small>
                            <h2>4566</h2>
                            <small>Top 24%</small>
                        </div>
                        {/* <div className={styles.stat}>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486901/Screenshot_20260603_171033_Gallery_x2jmce.jpg"></img>
                            <small>Matches Played</small>
                            <h2>40</h2>
                            <small>Top 10%</small>
                        </div>
                        <div className={styles.stat}>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486901/Screenshot_20260603_171049_Gallery_ckve7p.jpg"></img>
                            <small>MVP</small>
                            <h2>23</h2>
                            <small>Top 10%</small>
                        </div>
                        <div className={styles.stat}>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486900/Screenshot_20260603_171110_Gallery_bobgvq.jpg"></img>
                            <small>Win Rate</small>
                            <h2>70 %</h2>
                            <small>Top 8%</small>
                        </div> */}
                        <Link to="">View more</Link>
                    </div>
                </div>

                <div className={styles.recent_tour}>
                    <h2>Recent Matches</h2>
                    <div className={styles.tour_list}>
                        <div className={styles.tour}>
                            <div className={`${styles.box} ${styles.img}`}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className={`${styles.box} ${styles.victor_defeat}`}><p>VICTORY</p></div>
                            <div className={`${styles.box} ${styles.kills}`}><p>19</p><br /><small>Kills</small></div>
                            <div className={`${styles.box} ${styles.winings}`}><p>$3940</p><br /><small>Winnings</small></div>
                            <div className={`${styles.box} ${styles.date_time}`}><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className={`${styles.box} ${styles.details}`}><button>View Details</button></div>
                        </div>
                         <div className={styles.tour}>
                            <div className={`${styles.box} ${styles.img}`}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className={`${styles.box} ${styles.victor_defeat}`}><p>VICTORY</p></div>
                            <div className={`${styles.box} ${styles.kills}`}><p>19</p><br /><small>Kills</small></div>
                            <div className={`${styles.box} ${styles.winings}`}><p>$3940</p><br /><small>Winnings</small></div>
                            <div className={`${styles.box} ${styles.date_time}`}><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className={`${styles.box} ${styles.details}`}><button>View Details</button></div>
                        </div>
                        <div className={styles.tour}>
                            <div className={`${styles.box} ${styles.img}`}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className={`${styles.box} ${styles.victor_defeat}`}><p>VICTORY</p></div>
                            <div className={`${styles.box} ${styles.kills}`}><p>19</p><br /><small>Kills</small></div>
                            <div className={`${styles.box} ${styles.winings}`}><p>$3940</p><br /><small>Winnings</small></div>
                            <div className={`${styles.box} ${styles.date_time}`}><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className={`${styles.box} ${styles.details}`}><button>View Details</button></div>
                        </div>
                         <div className={styles.tour}>
                            <div className={`${styles.box} ${styles.img}`}><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className={`${styles.box} ${styles.victor_defeat}`}><p>VICTORY</p></div>
                            <div className={`${styles.box} ${styles.kills}`}><p>19</p><br /><small>Kills</small></div>
                            <div className={`${styles.box} ${styles.winings}`}><p>$3940</p><br /><small>Winnings</small></div>
                            <div className={`${styles.box} ${styles.date_time}`}><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className={`${styles.box} ${styles.details}`}><button>View Details</button></div>
                        </div>
                    </div>
                </div>
            </div>
       </>
    )
)}
