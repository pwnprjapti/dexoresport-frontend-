import '../App.css'
import Nav from '../compo/nav.jsx'
import Footer from '../compo/Footer.jsx'
import Loading from '../compo/Loading.jsx'
import TournamentCard from '../compo/TournamentCard.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

//icons

import { AiOutlineUserAdd } from "react-icons/ai";
import { MdLeaderboard } from 'react-icons/md';
import { SlCalender } from 'react-icons/sl';

export default function Home() {
    const [ loading, setLoading ] = useState(true);

    const navigate = useNavigate();
    const [future, setFuture ] = useState([]);
    const [live, setLive ] = useState([]);
    const [past, setPast ] = useState([]);
    const [ enteries, setEnteries ] = useState(0);

    const getTournaments = async () => {
        setLoading(true);
       try{
        const res_future = await fetch(`${import.meta.env.VITE_BASE_URL}/future`);
        const res_live = await fetch(`${import.meta.env.VITE_BASE_URL}/live`);
        const res_past = await fetch(`${import.meta.env.VITE_BASE_URL}/past`);

        const future = await res_future.json();
        const live = await res_live.json();
        const past = await res_past.json();

        setFuture(future);
        setLive(live);
        setPast(past);

       }catch(err){
        console.log(err);
       }finally{
        setLoading(false);
       }
    }
    
    useEffect(()=>{
        getTournaments();
    }, [])

    return (
        <>
        { loading ? (
            <Loading />
        ) : (

          <>
            <Nav />
        <div className="home">
            <div className="intro">
                <div className="title-wrapper">
                    <div className="fire-sparks">
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                        <span className="ember"></span>
                    </div>
                    <div className='label'>India's #1 BGMI Tournament Plateform</div>
                    <h2>COMPETE</h2>
                    <h2>Win <span>CASH. </span></h2>
                    <h2>BUILD YOUR <span style={{'color':'rgb(254, 38, 244)'}}>LEGACY. </span></h2>
                </div>
                <p>Join thousands of BGMI warriors competing daily for real cash prizes. Free tournaments, instant payouts, and zero BS.</p>
                <div className="btns">
                    <button className='btn1' onClick={()=> navigate("/login")}>Explore Tournaments <i className="fa-solid fa-arrow-right-long" style={{"color": "white", "font-size":"medium"}}></i></button>
                    <button className='btn2' onClick={()=> navigate("/login")}>Be an Organizer <i className="fa-regular fa-user" style={{"color": "rgb(255, 39, 255)", "font-size":"medium"}}></i></button>
                </div>
                <img src="/bgmi_character.jpg" alt="BGMI Mascot Character" className="hero_image" />
                <div className='cards'>
                    <div className='card'><i className="fa-solid fa-user-group" style={{"color": "rgb(252, 2, 214)", "border-radius":"5px", "backgroundColor":"rgb(252, 2, 214, 0.20)", "padding":"2vw", "border":"none", "font-size":"medium"}}></i> <h4>100 +<br /> <span>Active Players</span></h4></div>
                    <div className='card'><i className="fa-solid fa-trophy" style={{"color": "rgb(2, 219, 252)", "border-radius":"5px", "backgroundColor":"rgba(2, 219, 252, 0.20)", "padding":"2vw", "border":"none", "font-size":"medium"}}></i> <h4> {live.length} +<br /><span>Prize Distributed</span></h4></div>
                    <div className='card'><i className="fa-duotone fa-solid fa-sack-dollar" style={{"color": "rgb(252, 56, 2)", "border-radius":"5px", "backgroundColor":"rgba(252, 56, 2, 0.20)", "padding":"2vw", "border":"none", "font-size":"medium"}}></i><h4> {future.length + live.length + past.length} +<br /><span>Tournaments</span></h4></div>
                    <div className='card'><i className="fa-jelly fa-solid fa-gamepad" style={{"color": "rgb(2, 252, 27)", "border-radius":"5px", "backgroundColor":"rgba(2, 252, 27, 0.20)", "padding":"2vw", "border":"none", "font-size":"medium"}}></i><h4> 10 + <br /> <span>Matches Played</span></h4> </div>
                </div>
            </div>
             
             <h2>UPCOMING <span>TOURNAMENTS</span></h2>
            <div className=' upcoming'>
                {future.length === 0 ? <div className='no'>No tournaments right now </div> : future.map((match)=>(
                    // console.log(match)
                    <TournamentCard match={match} />
                
                ))}
             
            </div>

           <div className='how_it_works'>
              <small>EASY STEPS</small>
              <h1>HOW IT WORKS</h1>
              <div className='steps'>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-user-plus" style={{"color": "rgb(252, 2, 252)", "font-size":"small"}}></i></div>
                    </div>
                    <h3><small>01</small> REGISTER</h3>
                    <p>Create your account and complete your Profile.</p>
                </div>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-trophy" style={{"color": "rgb(252, 2, 252)", "font-size":"small"}}></i></div>
                    </div>
                    <h3><small>02</small> JOIN TOURNAMENT</h3>
                    <p>Choose a tournament that fits your game and skill.</p>
                </div>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-person-military-rifle" style={{"color": "rgb(252, 2, 252)", "font-size":"small"}}></i></div>
                    </div>
                    <h3><small>03</small> COMPETE</h3>
                    <p>Play your matches and showcase your skills.</p>
                </div>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-crown" style={{"color": "rgb(252, 2, 252)", "font-size":"small"}}></i></div>
                    </div>
                    <h3><small>04</small> WIN AND EARN</h3>
                    <p>Climb the leaderboard and win exciting rewards.</p>
                </div>  
              </div> 
           </div>      

            <div className='why'>
                <h1>Why <span>Join Us ?</span></h1>
                <div className="cards">
                    <div className='card'>
                        <div className='icon'><i className="fa-solid fa-shield awesome_icon" style={{"color": "rgb(17, 255, 0)", "background-color":"rgba(17, 255, 0, 0.37)", "border":"1px solid rgb(0, 255, 0)"}}></i></div>
                        <h2>Verified Organizers</h2>
                        <p>All organizers go through our verification process with trust scores and badges</p>
                    </div>
                    <div className='card'>
                        <div className='icon'><i className="fa-solid fa-user-check awesome_icon" style={{"color": "rgb(21, 79, 254)", "background-color":"rgba(21, 79, 254, 0.37)", "border":"1px solid rgb(21, 79, 254)"}}></i></div>
                        <h2>Zero Plateform Fee</h2>
                        <p>Players do not pay plateform fee, Registeration is handled by organizers </p>
                    </div>
                    <div className='card'>
                        <div className='icon'><i className="fa-solid fa-award awesome_icon" style={{"color": "rgb(216, 255, 42)", "background-color":"rgba(216, 255, 42, 0.37)", "border":"1px solid rgb(216, 255, 42)"}}></i></div>
                        <h2>Guaranteed Prizes</h2>
                        <p>All tournaments feature guaranteed prize pools with transparent payout structures</p>
                    </div>
                    <div className='card'> 
                        <div className='icon'><i className="fa-solid fa-coins awesome_icon" style={{"color": "gold", "background-color":"rgba(243, 248, 0, 0.37)", "border":"1px solid gold"}}></i></div>
                        <h2>Earn Your Entry</h2>
                        <p>Don't have enough balance? Complete tasks, collect coin and turn them into your tournament entry.</p>
                    </div>
                </div>
            </div>

            <div className='for_organizers'>
                <h1>For <span>Organizers</span></h1>
                <p>A simple path to grow your community and build a trusted organizer profile.</p>
                <div className='cards'>
                    <div className='card'>
                        <small>STEP 1</small>
                        <h2>List</h2>
                        <p>Publish your tournament with clear rules and prizes.</p>
                    </div>

                    <div className='card'>
                        <small>STEP 2</small>
                        <h2>Get Players</h2>
                        <p>Derive registerations through your channels and whatsapp groups.</p>
                    </div>

                    <div className='card'>
                        <small>STEP 3</small>
                        <h2>Build Reputation</h2>
                        <p>Host tournaments consistently and earn trust stars.</p>
                    </div>

                    {/* <div className='card'>
                        <small>STEP 4</small>
                        <h2>List</h2>
                        <p>Publish your tournament with clear rules and prizes.</p>
                    </div> */}
                    
                </div>
            </div>

            <div className='why_organizer_choose_us'>
                <h1>Why Organizers <span>Choose Us ? </span></h1>
                <p>Built to help organizers save time, attract more players and maximize revenue.</p>
                <div className='cards'>
                    <div className='card'>
                        <i className="fa-solid fa-gamepad" style={{"color": "rgba(82, 81, 82, 0.94)"}}></i>
                        <h2>Easy Tournament Management</h2>
                        <p>Create and manage BGMI tournaments in minutes with an intuitive dashboard. No technical skills required</p>
                    </div>
                    <div className='card'>
                        <i className="fa-solid fa-sack-dollar" style={{"color": "rgba(249, 253, 3, 0.94)", "backgroundColor":"rgba(249, 253, 3, 0.25)"}}></i>
                        <h2>Automated Entry Fee Collection</h2>
                        <p>Secure online payments and automatic participant registeration save hours of manual work.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-bullhorn" style={{"color": "rgb(254, 5, 254)"}}></i>
                        <h2>Whatsapp Auto Promotion</h2>
                        <p>Instantly share tournament details, banners, slots updates, and registeration notifications directly to your whatsApp communities.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-robot" style={{"color": "rgba(6, 192, 243, 0.94)"}}></i>
                        <h2>AI Banner Genration</h2>
                        <p>Genrate proffesinal tournament posters and promotional banners within seconds using Ai.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-user-group" style={{"color": "rgba(82, 81, 82, 0.94)"}}></i>
                        <h2>Player Community Access</h2>
                        <p>Reach a growing network of competitive BGMI players ready to join new tournaments.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-bell" style={{"color": "gold"}}></i>
                        <h2>Real-Time Notifications</h2>
                        <p>Get instant alerts whenever a player registers, slots fill up or important tournament events occur.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-square-poll-vertical" style={{"color": "rgba(19, 61, 247, 0.94)"}}></i>
                        <h2>Tournament Analytics</h2>
                        <p>Track registeration, revenue, slot occupancy and tournament performance through detailed insights.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-trophy" style={{"color": "rgba(249, 245, 6, 0.94)"}}></i>
                        <h2>Multiple Tournament Formats</h2>
                        <p>Host Solo, Duo, Sqaud, TDM, Custom Room, Scrims and special events from a single platform.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-wallet" style={{"color": "rgba(251, 11, 167, 0.94)"}}></i>
                        <h2>Wallet & Coin System</h2>
                        <p>Players can use wallet balance and earned coins to join tournaments, increasing participation rates.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-mobile" style={{"color": "rgba(5, 197, 255, 0.94)"}}></i>
                        <h2>Mobile Friendly Dashboard</h2>
                        <p>Manage your tournaments anytime, anywhere from your smartphone or desktop.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-shield" style={{"color": "rgba(252, 1, 252, 0.94)"}}></i>
                        <h2>Secure and Reliable Platform</h2>
                        <p>Built with secure payment proccesing and reliable infrastructure to ensure smooth tournament operations.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-hand-holding-dollar" style={{"color": "rgba(210, 252, 20, 0.94)"}}></i>
                        <h2>Higher Earnings Potential</h2>
                        <p>Reduce operational workload and focus on growing your community and revenue.</p>
                    </div>
                </div>
            </div>

            <div className='ready_to_organize'>
                <h1>Ready to <span>Start</span> Organizing ?</h1>
                <p>Join hundreds of trusted organizers who use our platform to promote their tournaments and connect with the Free Fire community.</p>
                <button>View Pricing </button>
            </div>
            <Footer />
        </div>
       </>

      )}
        
     </>
    )
}