import "../css/tournaments.css"
import Nav from '../compo/nav.jsx'
import Footer from '../compo/Footer.jsx'
import Loading from '../compo/Loading.jsx'
import TournamentCard from "../compo/TournamentCard.jsx"
import { useState, useEffect } from 'react'
import { useTenant } from '../../context/TenantContext.jsx'

export default function Tournaments(){
    const [loading, setLaoding] = useState(true);
    const { isTenant, tenantSlug, tenant } = useTenant();
    const [future, setFuture ] = useState([]);
    const [live, setLive ] = useState([]);
    const [past, setPast ] = useState([]);

    const getTournaments = async () => {
       try{
        const queryParam = tenantSlug ? `?org=${encodeURIComponent(tenantSlug)}` : '';
        const res_future = await fetch(`${import.meta.env.VITE_BASE_URL}/future${queryParam}`);
        const res_live = await fetch(`${import.meta.env.VITE_BASE_URL}/live${queryParam}`);
        const res_past = await fetch(`${import.meta.env.VITE_BASE_URL}/past${queryParam}`);

        const futureData = await res_future.json();
        const liveData = await res_live.json();
        const pastData = await res_past.json();

        setFuture(Array.isArray(futureData) ? futureData : []);
        setLive(Array.isArray(liveData) ? liveData : []);
        setPast(Array.isArray(pastData) ? pastData : []);

       }catch(err){
        console.log(err);
       }finally{
        setLaoding(false)
       }
    }
    
    useEffect(()=>{
        getTournaments();
    }, [tenantSlug])


    return(
        <>
        { loading ? (
            <Loading />
        ):(

        <>
           <Nav />
        <div className="container">
         <h2>UPCOMING <span>TOURNAMENTS</span></h2>
            <div className=' upcoming'>
                {future.length === 0 ? <div className='no'>No tournaments right now </div> : future.map((match, idx)=>(
                    <TournamentCard key={match?._id || idx} match={match} />
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
                { past.length === 0 ? <div className='no'>No past tournaments right now </div> : past.map((match)=>(
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
            <Footer />
          </div>
        </>

        )}
        </>
    )
}