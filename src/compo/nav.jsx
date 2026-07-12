import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../App.css'
import { FaHome } from "react-icons/fa"
import {  MdLeaderboard  } from "react-icons/md"
import { ImBlogger2 } from "react-icons/im";
import { FiLogIn } from "react-icons/fi";
import { GiWaterGun } from "react-icons/gi";


export default function Nav(){
    const navigate = useNavigate();

    const [status, setStatus] = useState();
    const [menuState, setMenuState ] = useState(false);

    const islogedin = async () => {
        const token = localStorage.getItem("jwt");

        if(!token){
            console.log("no token found");
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/islogedin`, {
            method:'POST',
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        setStatus(res.status);
    }

    useEffect(()=>{
        islogedin();
    }, [status]);

    const menu = () =>{
        menuState ? setMenuState(false) : setMenuState(true);
    }

    return (
        
         <nav>
            <img className="logo" src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Dexor Esport" />
            <button className='menu' onClick={menu}>{ menuState ? 'close' : 'menu'}</button>
            <div className="links" style={menuState ? {'display':'flex'}:{'display':'none'}}>
                <Link to="/"><FaHome /> Home</Link>
                <Link to="/tournaments"><GiWaterGun /> Tournaments</Link>
                <Link to="/leaderboard"><MdLeaderboard  /> Leaderboard</Link>
                <Link to="/blog"><ImBlogger2 /> Blog</Link>
                <Link style={ status === 401 ? {"display":"block"} : {"display":"none"}} to="/login"><FiLogIn /> Login</Link>
                <button style={ status === 401 ? {"display":"block"} : {"display":"none"}} onClick={() => navigate("/signup")}>Join now</button>
               
                 {/* if user is authenticated */}
                
                <Link style={ status === 401 ? {"display":"none"} : {"display":"block"}} to="/notification">Notification</Link>
                <Link style={ status === 401 ? {"display":"none"} : {"display":"block"}} to="/profile">Profile</Link>
                
            </div>
         </nav>
       
    )
}