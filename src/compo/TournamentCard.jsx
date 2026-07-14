import { useNavigate } from "react-router-dom"

export default function TournamentCard({ match }){
    const navigate = useNavigate(0);

    const remaining_slots = (match?.ttl_slots ?? 0 ) - (match?.enteries?.length ?? 0);

    return (
        <div key={match?._id} className='card'>
                    <img alt="logo" src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" />
                    <h2>{match?.game1}<br /> {match?.game2}</h2>
                    <p>🏆 {match?.prizepool} INR</p>
                    <div className='innr_card'>
                        <div className='detail_card prize_detail'>
                           <p>1st Prize:  <span>{match?.first}</span></p> 
                           <p>1st Prize:  <span>{match?.second}</span></p> 
                           <p>1st Prize:  <span>{match?.third}</span></p>    
                           <p>1st Prize:  <span>{match?.fourth}</span></p>    
                        </div>
                        <div className='detail_card game_details'>
                            <p>Map:  <span>{match?.map}</span></p> 
                            <p>Team Size:  <span>{match?.Team_size}</span></p> 
                            <p>Mode:  <span>{match?.mode}</span></p> 
                            <p>Remaining Slots: <span>{remaining_slots}</span></p>   
                        </div>
                    </div>
                    <div className='btns'>
                        <button className='rulebook'>RULEBOOK</button>
                        <button className='join' onClick={() => navigate(`/join/${match?._id}`)}>Join Now</button>
                    </div>
                 </div>
    )
}