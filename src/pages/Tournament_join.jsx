import { resolvePath, useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import Nav from '../compo/nav';
import EndTimer from '../compo/EndTimer';
import "../css/tour_join.css"
import { FaMap } from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";
import { IoMedal } from "react-icons/io5";
import { CiMedal } from "react-icons/ci";
import { GiSportMedal } from "react-icons/gi";
import { IoDiamondSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router-dom"


export default function Tournament_join(){

    const navigate = useNavigate();

    const btnConfig = {
        default:{
            class:"enabled",
            text:"Register Your Team",
            disabled:false
        },

        registered:{
            class:"disabled",
            text:"Registered ✓",
            disabled:true
        }
    }

    const [ tournament, setTournament ] = useState({});
    const [ isRegistered ,setIsRegistered ] = useState();

    const [ btnstate, setBtnstate ] = useState(btnConfig.default);

    const { id } = useParams();

    const getTournament = async () => {
       try{
        const token = localStorage.getItem("jwt");
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tournament_details`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({id})
        });
        const data = await res.json();

        console.log(data.tournament);

        if(res.status === 401){
            navigate("/login");
        }

        setTournament(data.tournament);
        setIsRegistered(res.status);
       }catch(err){
        console.log(err);
       }
    }


    useEffect(()=>{
        getTournament();
    }, []);

   const loadScript = () => {
       return new Promise((resolve) => {
        const script = document.createElement("script");
       script.src = import.meta.env.VITE_RAZORPAY_SRC;
       script.onload = () => resolve(true);
       script.onerror = () => resolve(false);
       document.body.appendChild(script);
       });
   }

    const tour_join = async () => {
        const token = localStorage.getItem("jwt");
        if(!token){
            console.log("no token found");
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/join`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({ id })
        })

        const data = await res.json();
        console.log(res.status, data);

        if(res.status === 401){
            alert("please login to continue....", navigate("/login"));
        }

        if(res.status === 422){
            setBtnstate(btnConfig.registered);
        }

        if(res.status === 200){
            alert("Tournament registeration succefull ✓");
        }
    }

   const handlePayment = async () => {
      const token = localStorage.getItem("jwt");
      const isScriptLoaded = await loadScript();

      if(!isScriptLoaded){
        alert("error in loading razorpay payment page");
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/createOrder`, {
            method:'POST',
            headers:{ 
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({ amount:3000})
        });

        const order = await response.json();
        console.log(order);

        if(response.status === 401){
            alert("please login to continue....", navigate("/login"));
        }

        // razorpay checkout options

        const options = {
            "key":"rzp_test_SZJyAbRVnvzKih",
            "amount":order.amount,
            "currency":"INR",
            "name":"DEXOR ESPORT",
            "order_id":order.id,
            "handler": async function (response){
                console.log(response);
                //payment details verificaton ke liye backend ko bhejna 
                const verifyres = await fetch(`${import.meta.env.VITE_BASE_URL}/verifyOrder`, {
                    method:'POST',
                    headers:{ 
                         'Content-Type':'application/json',
                          Authorization:`Bearer ${token}`
                    },
                    body: JSON.stringify(response)
                });

                const result = await verifyres.json();
                if(result.success){
                    alert("payment succefull");
                    tour_join();
                }else{
                    alert('payment failed')
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
   }


   const [ btm_btn_visible, setBtm_btn_visible ] = useState(false);
   useEffect(()=>{
       function btm_btn_visibility(){
        if(window.scrollY > 300){
            setBtm_btn_visible(true);
        } else {
            setBtm_btn_visible(false);
        }
       };

       window.addEventListener('scroll', btm_btn_visibility);

       return () => {
        window.removeEventListener('scroll', btm_btn_visibility);
       };
   }, []);

    return (
        <>
        <Nav />
         <div className='box'>
            <div className='poster'>
                <img src='https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780371407/7f2fd805b3300988ed62b2df0ece536ac53a054717947090d0f73bade54f7ec3_lfwy2x.png' alt="match poster" />
                <h2>{tournament.tournament_name}</h2>
                <p className='brief'>geyfhfyuu hkkhiu jk{tournament.disc}</p>
                <div className='poster_cards'>
                    <div className='card'>
                        28 may 2024
                    </div>
                    <div className='card'>
                        07:00 PM IST
                    </div>
                    <div className='card'>
                        {Array.isArray(tournament.enteries) ? tournament.enteries.length : 0}/{tournament.ttl_slots || ''} Teams
                    </div>
                </div>
               
                <div className='btns'>
                    <button className={ isRegistered === 422 ? 'disabled' : 'enabled'} disabled={isRegistered === 422 ? true : false} onClick={handlePayment}>{ isRegistered === 422 ? "Registered ✓" : "Join Now" }</button>
                    <button>Share </button>
                </div>

                 {/* <p className='organization'>Organized by <span>HunterX esport</span></p> */}
            </div>
            <p className='organization'>Organized by <span>HunterX esport</span></p>

            <EndTimer endDate={tournament.regis_end_date} endTime={tournament.regis_end_time} />

            <div className='part1'>
                <div className='box1'>
                     <div className='innr'>
                        <h3>Tournament overview</h3>
                        <p>BGmi summer showdown is an exclusive battle raoyale tournament hwer ethe best squads comptete for glory huge prixed and the ultimate champion title. Get red for intense marches and non stop action.</p>
                        <div className='cards'>
                            <div className='card'>
                                <p>Team Format <br /><span>{tournament.Team_size}</span></p>
                            </div>
                            <div className='card'>
                                <p>Entry Fee <br /><span>$100/team</span></p>
                            </div>
                            <div className='card'>
                                <FaMap /><p>Map <br /><span>{tournament.map}</span></p>
                            </div>
                            <div className='card'>
                                <p>Mode <br /><span>{tournament.mode}</span></p>
                            </div>
                        </div>
                     </div>
                     <div className='innr2'>
                        <h3>Tournament Details</h3>
                       <div className='box'>
                        <div className='details'>
                            <p>Tournament Type    <br /><span>Battle Royale</span></p>
                            <p>Team Size    <br /><span>{tournament.Team_size}</span></p>
                            <p>Entry Fee    <br /><span>$100/Team</span></p>
                            <p>Max Teams    <br /><span>{tournament.ttl_slots}</span></p>
                            <p>Region     <br /><span>India</span></p>
                            {/* <p>Organized By   <br /><span>HUnerx esport</span></p> */}
                        </div>
                        <div className='details details2'>
                            <p><SlCalender /> Registeration Start  <br /><span>12 May, 2024 - 12:00 PM IST</span></p>
                            <p><SlCalender /> Registeration End   <br /><span>13 May, 2024 - 12:00 PM IST</span></p>
                            <p><SlCalender /> Tournament Start   <br /><span>25 May, 2024 - 12:00 PM IST</span></p>
                            <p><SlCalender /> Tournament End   <br /> <span>25 May, 2024 - 12:00 PM IST</span></p>
                            <p>Contact   <br /><span>support@ghunterx.com</span></p>
                        </div>
                       </div>
                     </div>
                </div>
                <div className='box2'>
                    <div className='innr'>
                        <h3><IoDiamondSharp /> Prize Pool</h3>
                        <div className='prizepool'><p>${tournament.prizepool} </p><br /> <span><p>Total Prize Pool</p></span></div>
                        <p><FaMedal /> 1st Prize   <span>${tournament.first}</span></p>
                        <p><IoMedal /> 2nd Prize   <span>${tournament.second}</span></p>
                        <p><CiMedal /> 3rd Prize   <span>${tournament.third}</span></p>
                        <p><GiSportMedal /> 4th Prize   <span>${tournament.fourth}</span></p>
                    </div>
                    <div className='innr2'>
                        <h2>Rules And Regulations</h2>
                        <li>All matches will be played in Tpp mode.</li>
                        <li>Teams must check in 30 min. before match start.</li>
                        <li>Use of Emulator & hacks is strickly prohibited.</li>
                        <li>organizer,s decions is final decions.</li>
                        <button>View Full RuleBook</button>
                    </div>
                </div>
            </div>

            <div className='part2'>
                <div className='box'>
                    <h3>Match Schedule</h3>
                    <div className='timeline'>
                        <div className='content'>
                            <div className='circle'></div>
                              <div className='line'>
                                25 may   <span>09:00 pm Ist</span> Round 1 - Group Stage 
                              </div>
                        </div><div className='content'>
                            <div className='circle'></div>
                              <div className='line'>
                                25 may   <span>09:00 pm Ist</span> Round 1 - Group Stage 
                              </div>
                        </div>
                        <div className='content'>
                            <div className='circle'></div>
                              <div className='line'>
                                25 may   <span>09:00 pm Ist</span> Round 1 - Group Stage 
                              </div>
                        </div>
                    </div>
                </div>
                {/* <div className='box'></div> */}
            </div>
           { btm_btn_visible && (
             <button className={ isRegistered === 422 ? 'bottom_btn disabled' : 'bottom_btn enabled'} disabled={isRegistered === 422 ? true : false} onClick={tour_join}>{ isRegistered === 422 ? "Registered ✓" : "Join Now"}</button>
           )}
        </div>
        </>
    )
}