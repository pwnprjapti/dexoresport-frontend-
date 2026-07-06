import '../css/Profile.css'
import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Nav from "../compo/nav";
import Tournament_join from "./Tournament_join";

import { SlCalender } from "react-icons/sl";

export default function Profile() {
     const { usr_id } = useParams();
     const [userdata, setUserdata] = useState({})

     const getuserdata = async () => {
        const token = localStorage.getItem("jwt");
        // console.log(token)
        if(!token){
            console.error("no token found")
            navigate("/login");
            return;
        }

        const res = await fetch('http://localhost:3000/profile', {
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
        <>
              <Nav />
            <div className='container'>
                <div className='box1'>
                    <div className='player_profile'>
                        <div className='dp'></div>
                        <div className='biodata'>
                            <h2>HunterXm416</h2>
                            <small>UID: 554643533</small>
                            <div className='joined'><SlCalender /> Joined May 2026</div>
                        </div>
                    </div>
                    <div className='recent_info'>
                        <div className='info_box'><h2>23</h2><small>Tournament Played</small></div>
                        <div className='info_box'><h2>24</h2><small>Matches Won</small></div>
                        <div className='info_box'><h2>89%</h2><small>Win Rate</small></div>
                        <div className='info_box'><h2>$1200</h2><small>Total Earnings</small></div>
                        <div className='edit'><button>EDIT PROFILE</button></div>
                    </div>
                </div>

                <div className='box2'>
                    <div className='innr_box achive'>
                        <h2>ACHIEVEMENTS</h2>
                        <div className='achive_list'>
                          <div className='achievement'>
                            <div className='achive_logo'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170431_Gallery_webzfc.jpg" /></div>
                            <div className='achive_about'>
                                <h4>Tournament Champion <span>10/15</span></h4>
                                <small>Win 10 tournaments</small><div className='timeline'></div>
                            </div>
                          </div>
                          <div className='achievement'>
                            <div className='achive_logo'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170638_Gallery_sn5c14.jpg" /></div>
                            <div className='achive_about'>
                                <h4>Unstoppable <span>15/15</span></h4>
                                <small>Win 15 matches in a row</small><div className='timeline'></div>
                            </div>
                          </div>
                          <div className='achievement'>
                            <div className='achive_logo'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170408_Gallery_zvk82j.jpg" /></div>
                            <div className='achive_about'>
                                <h4>Sharp Shooter <span>100/100</span></h4>
                                <small>Get 100 headshots</small><div className='timeline'></div>
                            </div>
                          </div>
                          <div className='achievement'>
                            <div className='achive_logo'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486725/Screenshot_20260603_170747_Gallery_b09har.jpg" /></div>
                            <div className='achive_about'>
                                <h4>Early Bird <span>100%</span></h4>
                                <small>Participate in an early bird tournament</small><div className='timeline'></div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className='innr_box tour'>
                        <h2>YOUR TOURNAMENTS</h2>
                        <table className='tour_table'>
                            <thead>
                                <tr>
                                    <th>Tournament</th>
                                    <th>Type</th>
                                    <th>Rank</th>
                                    <th>Prizepool</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className='tour_info'>
                                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Tournament" />
                                            <span>BGMI Pro Showdown</span>
                                        </div>
                                    </td>
                                    <td><span className='type_badge'>SQUAD</span></td>
                                    <td><h4>#2</h4></td>
                                    <td><h4 className='wining'>$1000</h4></td>
                                    <td><small>May 20, 2026</small></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='stats'>
                    <h2>DETAILED STATS</h2>
                    <div className='stat_list'>
                        <div className='stat'>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486886/Screenshot_20260603_170937_Gallery_v15btp.jpg"></img>
                            <small>K/D Ratio</small>
                            <h2>2.45</h2>
                            <small>Top 18%</small>
                        </div>
                        <div className='stat'>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486902/Screenshot_20260603_171001_Gallery_ifinhr.jpg"></img>
                            <small>Headshot %</small>
                            <h2>20.6%</h2>
                            <small>Top 22%</small>
                        </div>
                        <div className='stat'>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486902/Screenshot_20260603_171018_Gallery_ac8sbq.jpg"></img>
                            <small>Avg. Damage</small>
                            <h2>4566</h2>
                            <small>Top 24%</small>
                        </div>
                        <div className='stat'>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486901/Screenshot_20260603_171033_Gallery_x2jmce.jpg"></img>
                            <small>Matches Played</small>
                            <h2>40</h2>
                            <small>Top 10%</small>
                        </div>
                        <div className='stat'>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486901/Screenshot_20260603_171049_Gallery_ckve7p.jpg"></img>
                            <small>MVP</small>
                            <h2>23</h2>
                            <small>Top 10%</small>
                        </div>
                        <div className='stat'>
                            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780486900/Screenshot_20260603_171110_Gallery_bobgvq.jpg"></img>
                            <small>Win Rate</small>
                            <h2>70 %</h2>
                            <small>Top 8%</small>
                        </div>
                    </div>
                </div>

                <div className='recent_tour'>
                    <h2>Recent Matches</h2>
                    <div className='tour_list'>
                        <div className='tour'>
                            <div className='box img'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className='box victor_defeat'><p>VICTORY</p></div>
                            <div className='box kills'><p>19</p><br /><small>Kills</small></div>
                            <div className='box winings'><p>$3940</p><br /><small>Winnings</small></div>
                            <div className='box date_time'><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className='box details'><button>View Details</button></div>
                        </div>
                        <div className='tour'>
                            <div className='box img'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className='box victor_defeat'><p>VICTORY</p></div>
                            <div className='box kills'><p>19</p><br /><small>Kills</small></div>
                            <div className='box winings'><p>$3940</p><br /><small>Winnings</small></div>
                            <div className='box date_time'><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className='box details'><button>View Details</button></div>
                        </div>
                        <div className='tour'>
                            <div className='box img'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className='box victor_defeat'><p>VICTORY</p></div>
                            <div className='box kills'><p>19</p><br /><small>Kills</small></div>
                            <div className='box winings'><p>$3940</p><br /><small>Winnings</small></div>
                            <div className='box date_time'><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className='box details'><button>View Details</button></div>
                        </div>
                        <div className='tour'>
                            <div className='box img'><img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780477076/file_0000000043ec7207bce522ad71807154_ksa0re.png" /></div>
                            <div className='box victor_defeat'><p>VICTORY</p></div>
                            <div className='box kills'><p>19</p><br /><small>Kills</small></div>
                            <div className='box winings'><p>$3940</p><br /><small>Winnings</small></div>
                            <div className='box date_time'><p>may 10, 2026</p><br /><small>10:45 PM</small></div>
                            <div className='box details'><button>View Details</button></div>
                        </div>
                    </div>
                </div>
            </div>
       </>
    )
}