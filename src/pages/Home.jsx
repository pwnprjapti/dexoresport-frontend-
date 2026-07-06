import '../App.css'
import Nav from '../compo/nav.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

//icons

import { AiOutlineUserAdd } from "react-icons/ai";
import { MdLeaderboard } from 'react-icons/md';

export default function Home() {
    const navigate = useNavigate();
    const [future, setFuture ] = useState([]);
    const [live, setLive ] = useState([]);
    const [past, setPast ] = useState([]);
    const [ enteries, setEnteries ] = useState(0)

    const getTournaments = async () => {
       try{
        const res_future = await fetch("http://localhost:3000/future");
        const res_live = await fetch("http://localhost:3000/live");
        const res_past = await fetch("http://localhost:3000/past");

        const future = await res_future.json();
        const live = await res_live.json();
        const past = await res_past.json();

        setFuture(future);
        setLive(live);
        setPast(past);

       }catch(err){
        console.log(err);
       }
    }
    
    useEffect(()=>{
        getTournaments();
    }, [])

    return (
        <>
        <Nav />
        <div className="home">
            <div className="intro">
                <div className='label'><li>India's #1 BGMI Tournament Plateform</li></div>
                <h2>Play. Win. <span>Earn. </span></h2>
                <p>Join thousands of BGMI warriors competing daily for real cash prizes.<br /> Free tournaments, instant payouts, and zero BS.</p>
                <div className="btns">
                    <button onClick={()=> navigate("/login")}>Explore Tournaments</button>
                    <button className='btn2' onClick={()=> navigate("/login")}>Be an Organizer</button>
                </div>
                <div className='cards'>
                    <div className='card'>100 <br /><span>Player</span></div>
                    <div className='card'> {live.length} <br /><span>Live</span></div>
                    <div className='card'> {future.length + live.length + past.length} <br /><span>Tournaments</span></div>
                    <div className='card'> 10 <br /> <span>Enteries</span> </div>
                </div>
            </div>
             
             <h2>UPCOMING TOURNAMENTS</h2>
            <div className=' upcoming'>
                {future.length === 0 ? <div className='no'>No tournaments right now </div> : future.map((match)=>(
                     <div key={match._id} className='card'>
                    <img alt="logo" src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" />
                    <h2>{match.game1}<br /> {match.game2}</h2>
                    <p>🏆 {match.prizepool} INR</p>
                    <div className='innr_card'>
                        <div className='detail_card prize_detail'>
                           <p>1st Prize:  <span>{match.first}</span></p> 
                           <p>1st Prize:  <span>{match.second}</span></p> 
                           <p>1st Prize:  <span>{match.third}</span></p>    
                           <p>1st Prize:  <span>{match.fourth}</span></p>    
                        </div>
                        <div className='detail_card game_details'>
                            <p>Map:  <span>{match.map}</span></p> 
                            <p>Team Size:  <span>{match.Team_size}</span></p> 
                            <p>Mode:  <span>{match.mode}</span></p> 
                            <p>Remaining Slots: <span>{match.ttl_slots - match.enteries.length}</span></p>   
                        </div>
                    </div>
                    <div className='btns'>
                        <button className='rulebook'>RULEBOOK</button>
                        <button className='join' onClick={() => navigate(`/join/${match._id}`)}>Join Now</button>
                    </div>
                 </div>

                ))}

            </div>

           <div className='how_it_works'>
              <small>EASY STEPS</small>
              <h1>HOW IT WORKS</h1>
              <div className='steps'>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-user-plus" style={{"color": "rgb(252, 2, 252)", "font-size":"25px"}}></i></div>
                    </div>
                    <h3><small>01</small> REGISTER</h3>
                    <p>Create your account and complete your Profile.</p>
                </div>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-trophy" style={{"color": "rgb(252, 2, 252)", "font-size":"25px"}}></i></div>
                    </div>
                    <h3><small>02</small> JOIN TOURNAMENT</h3>
                    <p>Choose a tournament that fits your game and skill.</p>
                </div>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-person-military-rifle" style={{"color": "rgb(252, 2, 252)", "font-size":"25px"}}></i></div>
                    </div>
                    <h3><small>03</small> COMPETE</h3>
                    <p>Play your matches and showcase your skills.</p>
                </div>
                <div className='step'>
                    <div className='icon'>
                        <div className='innr_icon'><i className="fa-solid fa-crown" style={{"color": "rgb(252, 2, 252)", "font-size":"25px"}}></i></div>
                    </div>
                    <h3><small>04</small> WIN AND EARN</h3>
                    <p>Climb the leaderboard and win exciting rewards.</p>
                </div>  
              </div> 
           </div>      

            <div className='why'>
                <h1>Why Join Us ?</h1>
                <div className="cards">
                    <div className='card'>
                        <div className='icon'><i className="fa-solid fa-shield" style={{"color": "rgb(23, 240, 6)", "font-size":"8vh"}}></i></div>
                        <h2>Verified Organizers</h2>
                        <p>All organizers go through our verification process with trust scores and badges</p>
                    </div>
                    <div className='card'>
                        <div className='icon'><i className="fa-solid fa-user-check" style={{"color": "rgb(89, 130, 254)", "font-size":"8vh"}}></i></div>
                        <h2>Zero Plateform Fee</h2>
                        <p>Players do not pay plateform fee, Registeration is handled by organizers </p>
                    </div>
                    <div className='card'>
                        <div className='icon'><i className="fa-solid fa-award" style={{"color": "rgb(224, 254, 89)", "font-size":"8vh"}}></i></div>
                        <h2>Guaranteed Prizes</h2>
                        <p>All tournaments feature guaranteed prize pools with transparent payout structures</p>
                    </div>
                    <div className='card'> 
                        <div className='icon'><i className="fa-solid fa-coins" style={{"color": "gold", "font-size":"8vh"}}></i></div>
                        <h2>Earn Your Entry</h2>
                        <p>Don't have enough balance? Complete tasks, collect coin and turn them into your tournament entry.</p>
                    </div>
                </div>
            </div>

            <div className='for_organizers'>
                <h1>For Organizers</h1>
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
                <h1>Why Organizers Choose Us ? </h1>
                <p>Built to help organizers save time, attract more players and maximize revenue.</p>
                <div className='cards'>
                    <div className='card'>
                        <i className="fa-solid fa-gamepad" style={{"color": "rgba(82, 81, 82, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Easy Tournament Management</h2>
                        <p>Create and manage BGMI tournaments in minutes with an intuitive dashboard. No technical skills required</p>
                    </div>
                    <div className='card'>
                        <i className="fa-solid fa-sack-dollar" style={{"color": "rgba(249, 253, 3, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Automated Entry Fee Collection</h2>
                        <p>Secure online payments and automatic participant registeration save hours of manual work.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-bullhorn" style={{"color": "rgb(254, 5, 254)", "font-size":"4vw"}}></i>
                        <h2>Whatsapp Auto Promotion</h2>
                        <p>Instantly share tournament details, banners, slots updates, and registeration notifications directly to your whatsApp communities.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-robot" style={{"color": "rgba(6, 192, 243, 0.94)", "font-size":"4vw"}}></i>
                        <h2>AI Banner Genration</h2>
                        <p>Genrate proffesinal tournament posters and promotional banners within seconds using Ai.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-user-group" style={{"color": "rgba(82, 81, 82, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Player Community Access</h2>
                        <p>Reach a growing network of competitive BGMI players ready to join new tournaments.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-bell" style={{"color": "gold", "font-size":"4vw"}}></i>
                        <h2>Real-Time Notifications</h2>
                        <p>Get instant alerts whenever a player registers, slots fill up or important tournament events occur.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-square-poll-vertical" style={{"color": "rgba(19, 61, 247, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Tournament Analytics</h2>
                        <p>Track registeration, revenue, slot occupancy and tournament performance through detailed insights.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-trophy" style={{"color": "rgba(249, 245, 6, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Multiple Tournament Formats</h2>
                        <p>Host Solo, Duo, Sqaud, TDM, Custom Room, Scrims and special events from a single platform.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-wallet" style={{"color": "rgba(251, 11, 167, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Wallet & Coin System</h2>
                        <p>Players can use wallet balance and earned coins to join tournaments, increasing participation rates.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-mobile" style={{"color": "rgba(5, 197, 255, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Mobile Friendly Dashboard</h2>
                        <p>Manage your tournaments anytime, anywhere from your smartphone or desktop.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-shield" style={{"color": "rgba(252, 1, 252, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Secure and Reliable Platform</h2>
                        <p>Built with secure payment proccesing and reliable infrastructure to ensure smooth tournament operations.</p>
                    </div>

                    <div className='card'>
                        <i className="fa-solid fa-hand-holding-dollar" style={{"color": "rgba(210, 252, 20, 0.94)", "font-size":"4vw"}}></i>
                        <h2>Higher Earnings Potential</h2>
                        <p>Reduce operational workload and focus on growing your community and revenue.</p>
                    </div>
                </div>
            </div>

            <div className='ready_to_organize'>
                <h1>Ready to Start Organizing ?</h1>
                <p>Join hundreds of trusted organizers who use our platform to promote their tournaments and connect with the Free Fire community.</p>
                <button>View Pricing </button>
            </div>
        </div>
        </>
    )
}