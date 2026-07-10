import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import '../css/login.css'
import Logo from '../compo/Logo.jsx'

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [pass, setPass ] = useState("");
    const [data, setdata ] = useState();

    const login = async () =>{
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email, pass})
        });

        const res_data = await res.json();
        console.log(res_data);
        setdata(res);

        if(res.status === 200){
            localStorage.setItem("jwt", res_data.token);
            navigate(`/profile`);
        } 

        // else if(res.status === 404 ){
        //     navigate('/signup');
        // }
    }

    return (
        <>
        
        <div className="login">
            <div className="card">
                <Logo />
                <div className="login_card">
                    <h1>Player <span>Login</span></h1>
                    <p style={{'color':'silver'}}>Login to your account and continue joining excited battles.</p>
                    <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" className="data" />
                    <input value={pass}  onChange={(e)=> setPass(e.target.value)} type="password" placeholder="Password" className="data" />
                    <div className={ !data || data.status === 200 ? "hide" : "show"}>Invalid credientials </div>
                    <button className="login_btn" onClick={()=> login()}>Login</button>
                    <Link to="/forgotpass">Forgotten password ?</Link>
                    <p>Don't have account yet ?</p>
                    <button onClick={() => navigate("/signup")}>Sign Up</button>
                </div>
                <small>By continuing you agree with our <Link>terms & conditoins</Link>, <Link>Privacy Policy</Link>, <Link>Refunt Policy</Link> and <Link>Battle rules</Link></small>
            </div>
        </div>
      </>
    )
}