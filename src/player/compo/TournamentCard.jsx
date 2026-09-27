import { useNavigate } from "react-router-dom"
import "./TournamentCard.css"

export default function TournamentCard({ match }){
    const navigate = useNavigate(0);

    const remaining_slots = (match?.ttl_slots ?? 0 ) - (match?.enteries?.length ?? 0);

    return (
        <div key={match?._id} className="tournament-card">
            <img className="tournament-card-logo" alt="logo" src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" />
            
            <h2 className="tournament-card-title">
                {match?.tournament_name || `${match?.game1} ${match?.game2}`}
            </h2>
            
            <p className="tournament-card-prize">🏆 {match?.prizepool || '0'} INR</p>
            
            <div className="tournament-card-inner">
                {/* Prize Split */}
                <div className="tournament-card-detail-col prize-split">
                   <p>1st Prize <span>{match?.first || 'N/A'}</span></p> 
                   <p>2nd Prize <span>{match?.second || 'N/A'}</span></p> 
                   <p>3rd Prize <span>{match?.third || 'N/A'}</span></p>    
                   <p>4th Prize <span>{match?.fourth || 'N/A'}</span></p>    
                </div>
                
                {/* Game Details */}
                <div className="tournament-card-detail-col game-details">
                    <p>Map <span>{match?.map || 'TBD'}</span></p> 
                    <p>Format <span>{match?.Team_size || 'Squad'}</span></p> 
                    <p>Mode <span>{match?.mode || 'TPP'}</span></p> 
                    <p className={remaining_slots <= 5 ? "low-slots" : ""}>
                        Slots Left <span>{remaining_slots > 0 ? remaining_slots : 'FULL'}</span>
                    </p>   
                </div>
            </div>
            
            <div className="tournament-card-btns">
                <button className="btn-rulebook">RULEBOOK</button>
                <button className="btn-join" onClick={() => navigate(`/join/${match._id}`)}>Join Now</button>
            </div>
         </div>
    )
}