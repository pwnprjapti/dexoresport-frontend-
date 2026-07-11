import "../css/tournaments.css"
import Nav from '../compo/nav.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Tournaments(){
    const navigate = useNavigate();
    const [future, setFuture ] = useState([]);
    const [live, setLive ] = useState([]);
    const [past, setPast ] = useState([]);
    const [ enteries, setEnteries ] = useState(0)

    const getTournaments = async () => {
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
       }
    }
    
    useEffect(()=>{
        getTournaments();
    }, [])


    return(
        <>
        <Nav />
        <div className="container">
         <h2>UPCOMING <span>TOURNAMENTS</span></h2>
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
                            <p>Remaining Slots: <span>{match.ttl_slots - match.enteries.length}/{match.ttl_slots}</span></p>   
                        </div>
                    </div>
                    <div className='btns'>
                        <button className='rulebook'>RULEBOOK</button>
                        <button className='join' onClick={() => navigate(`/join/${match._id}`)}>Join Now</button>
                    </div>
                 </div>

                ))}


            </div>
            
            <h2>LIVE <span>TOURNAMENTS</span></h2>
            <div className=' live'>
                { live.length === 0 ? <div className='no'>No LIve tournaments right now </div> : live.map((match)=>(
                    <div className='card' key={match._id}>
                    <div className='card_live'>
                    <img alt="logo" src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" />
                     <div className='innr_card'>
                    <h1>{match.game1} <br /> <span>{match.game2}</span></h1>
                        <h2> {match.prizepool}</h2>
                     </div>
                    </div>
                        <p> |{match.map} | {match.mode} | {match.size} | {match.date }| {match.time} |</p> <br />
                        <button>Watch Live</button>
                 </div>
                )) }

            </div>

            <h2>PAST <span>TOURNAMENTS</span></h2>
            <div className=' live'>
                { past.length === 0 ? <div className='no'>No LIve tournaments right now </div> : past.map((match)=>(
                    <div className='card' key={match._id}>
                    <div className='card_live'>
                    <img alt="logo" src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" />
                     <div className='innr_card'>
                    <h1>{match.game1} <br /> <span>{match.game2}</span></h1>
                        <h2> {match.prizepool}</h2>
                     </div>
                    </div>
                        <p> |{match.map} | {match.mode} | {match.size} | {match.date }| {match.time} |</p> <br />
                        <button> View Details </button>
                 </div>
                  )) }
            </div>
          </div>
        </>
    )
}