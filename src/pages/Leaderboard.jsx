import Nav from "../compo/nav";
import Footer from '../compo/Footer.jsx'
import "../css/leaderboard.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../compo/Loading.jsx";

const Leaderboard = () => {
    const { id } = useParams();
    console.log(id);

    const [ loading, setLoading ] = useState(true);

     const [ data, setData ] = useState({ top3players: [], otherPlayers: [] });

     const getLeaderboard = async () => {
         setLoading(true);

         const leaderboardres = await fetch(`${import.meta.env.VITE_BASE_URL}/leaderboard`, {
             method:'POST',
             headers:{
               "Content-Type":"application/json",
             },
             body:JSON.stringify({ id })
         });

         const leaderboard = await leaderboardres.json();

         console.log(leaderboard);
         console.log(leaderboard.top3players[0])
         setData(leaderboard);
         setLoading(false);
     }

useEffect(()=>{
    getLeaderboard();
}, []);

    return(
        <>
        { loading ? (
            <Loading /> 
        ):(
       <>
        <Nav />
        <div className="container">
            <div className="top_winners">
                <div className="winner second">
                    <div className="rank"><div className="innr_rank"><p>2</p></div></div>
                    <div className="dp"></div>
                    <h3>{data.top3players?.[1]?.player_name || 'No Player'}</h3>
                    <p>{data.top3players?.[1]?.points || 0} Points</p>
                    <div className="info">
                        <div className="box"><p>{data.top3players?.[1]?.wins || 0}</p><small>Wins</small></div>
                        <div className="box"><p>{data.top3players?.[1]?.kills || 0}</p><small>Kills</small></div>
                        <div className="box"><p>{data.top3players?.[1]?.kd || 0}</p><small>K/D</small></div>
                    </div>
                </div>
                <div className="winner first">
                    <div className="rank"><div className="innr_rank"><p>1</p></div></div>
                    <div className="dp"></div>
                    <h3>{data.top3players?.[0]?.player_name || 'No Player'}</h3>
                    <p>{data.top3players?.[0]?.points || 0} Points</p>
                    <div className="info">
                        <div className="box"><p>{data.top3players?.[0]?.wins || 0}</p><small>Wins</small></div>
                        <div className="box"><p>{data.top3players?.[0]?.kills || 0}</p><small>Kills</small></div>
                        <div className="box"><p>{data.top3players?.[0]?.kd || 0}</p><small>K/D</small></div>
                    </div>
                </div>
                <div className="winner third">
                    <div className="rank"><div className="innr_rank"><p>3</p></div></div>
                    <div className="dp"></div>
                    <h3>{data.top3players?.[2]?.player_name || 'No Player'}</h3>
                    <p>{data.top3players?.[2]?.points || 0} Points</p>
                    <div className="info">
                        <div className="box"><p>{data.top3players?.[2]?.wins || 0}</p><small>Wins</small></div>
                        <div className="box"><p>{data.top3players?.[2]?.kills || 0}</p><small>Kills</small></div>
                        <div className="box"><p>{data.top3players?.[2]?.kd || 0}</p><small>K/D</small></div>
                    </div>
                </div>
            </div>
            <div className="table">
               <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Plyer</th>
                        <th>Points</th>
                        <th>wins</th>
                        <th>Kills</th>
                        <th>F/D</th>
                        {/* <th>Action</th> */}
                    </tr>
                </thead>
                <tbody>
            
                    { (data.otherPlayers || []).length === 0 ? <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No players listed yet</td></tr> : (data.otherPlayers || []).map((player, i)=>(
                        <tr key={i}>
                        <td></td>
                        <td className="player_name"><div className="dp_t"></div> <p>{player.player_name}</p></td>
                        <td className="points">{player.points}</td>
                        <td>{player.wins}</td>
                        <td>{player.kills}</td>
                        <td>{player.kd}</td>
                        {/* <td><button onClick={}>View</button></td> */}
                    </tr>
                    ))}
                    
                </tbody>
               </table>
            </div>
        </div>
        <Footer />
        </>
                )
        }
     </>
    )
}

export default Leaderboard;