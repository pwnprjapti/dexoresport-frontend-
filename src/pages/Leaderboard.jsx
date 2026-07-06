import Nav from "../compo/nav";
import "../css/leaderboard.css"

const Leaderboard = () => {

    return(
        <>
        <Nav />
        <div className="container">
            <div className="top_winners">
                <div className="winner second">
                    <div className="rank"><div className="innr_rank"><p>2</p></div></div>
                    <div className="dp"></div>
                    <h3>HunterX</h3>
                    <p>533453 Points</p>
                    <div className="info">
                        <div className="box"><p>50</p><small>Wins</small></div>
                        <div className="box"><p>67</p><small>Kills</small></div>
                        <div className="box"><p>5.8</p><small>K/D</small></div>
                    </div>
                </div>
                <div className="winner first">
                    <div className="rank"><div className="innr_rank"><p>1</p></div></div>
                    <div className="dp"></div>
                    <h3>HunterX</h3>
                    <p>533453 Points</p>
                    <div className="info">
                        <div className="box"><p>50</p><small>Wins</small></div>
                        <div className="box"><p>67</p><small>Kills</small></div>
                        <div className="box"><p>5.8</p><small>K/D</small></div>
                    </div>
                </div>
                <div className="winner third">
                    <div className="rank"><div className="innr_rank"><p>3</p></div></div>
                    <div className="dp"></div>
                    <h3>HunterX</h3>
                    <p>533453 Points</p>
                    <div className="info">
                        <div className="box"><p>50</p><small>Wins</small></div>
                        <div className="box"><p>67</p><small>Kills</small></div>
                        <div className="box"><p>5.8</p><small>K/D</small></div>
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
                        <th>K/D</th>
                        <th>Matches</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td className="player_name"><div className="dp_t"></div> <p>HunterX</p></td>
                        <td className="points">3234</td>
                        <td>34</td>
                        <td>541</td>
                        <td>10.2</td>
                        <td>78</td>
                        <td><button>View Profile</button></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td className="player_name"><div className="dp_t"></div> <p>HunterX</p></td>
                        <td className="points">3234</td>
                        <td>34</td>
                        <td>541</td>
                        <td>10.2</td>
                        <td>78</td>
                        <td><button>View Profile</button></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td className="player_name"><div className="dp_t"></div> <p>HunterX</p></td>
                        <td className="points">3234</td>
                        <td>34</td>
                        <td>541</td>
                        <td>10.2</td>
                        <td>78</td>
                        <td><button>View Profile</button></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td className="player_name"><div className="dp_t"></div> <p>HunterX</p></td>
                        <td className="points">3234</td>
                        <td>34</td>
                        <td>541</td>
                        <td>10.2</td>
                        <td>78</td>
                        <td><button>View Profile</button></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td className="player_name"><div className="dp_t"></div> <p>HunterX</p></td>
                        <td className="points">3234</td>
                        <td>34</td>
                        <td>541</td>
                        <td>10.2</td>
                        <td>78</td>
                        <td><button>View Profile</button></td>
                    </tr>
                </tbody>
               </table>
            </div>
        </div>
        </>
    )
}

export default Leaderboard;