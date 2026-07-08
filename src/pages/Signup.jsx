import styles from '../css/signup.module.css'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../compo/Logo.jsx'
import { useState, useEffect } from 'react'

export default function Signup() {
    // const [ csrf, setCsrf ] = useState("");
    const [signupdata, setSignupdata] = useState({name:"", email:"", pass:"", ign:"", uid:""})

    const navigate = useNavigate();

    function signup(){
        navigate("/signup/verification")
    }

    const handleChange = (e) => {
        let {name, value} = e.target; 
        setSignupdata((prev) => ({...prev, [name]:value}))   
    }

    const send_signupdata = async (e) => {
        e.preventDefault();

        // Token fetch karo
        const csrfRes = await fetch("http://localhost:3000/getcsrf", {  credentials: 'include' });
        const csrfData = await csrfRes.json();
        // setCsrf(csrfData.csrfToken);

        const res = await fetch("http://localhost:3000/signup", {
            method:'POST',
            credentials: 'include',
            headers:{
                "Content-Type":"application/json",
                "x-csrf-token":csrfData.csrfToken
            },
            body:JSON.stringify(signupdata)
        });

        const data  = await res.json();
        console.log(data);
        if(data === "true"){
            console.log("user exist")
        }else{
            navigate(`/signup/verification/${data}`)
        }
    }

    return (
        <>
        <Logo />
        <div className={styles.login}>
            <div className={styles.card}>                <div>
                    <form className={styles.login_card} onSubmit={send_signupdata}>
                        <h2>Create Account</h2>
                     <p className={styles.txt}>Join the battle and prove your are the Legend</p>                    <input type="text" name="name" onChange={handleChange} placeholder="Name" className="data" />
                    <input type="email" name="email" onChange={handleChange} placeholder="Email" className="data" />
                    <input type="password" name="pass" onChange={handleChange} placeholder="Password" className="data" />
                    <label>BGMI details : </label>
                    <input type="text" name="ign" onChange={handleChange} placeholder="IGN(In Game name)" className="data" />
                    <input type="number" name="uid" onChange={handleChange} placeholder="UID e.g., 5534351343" className="data" />
                    <button type="submit">Sign Up</button>
                    <p>Already have an account ?</p>
                    <button onClick={()=> navigate("/login")}>Login</button>
                    </form>
                </div>
                 <small>By creating an account, you agree to our <Link>Terms and Conditions</Link>, <Link>Privacy & Policy</Link>, <Link>Refund Policy</Link>And <Link>Battle rules</Link></small>
            </div>
        </div>
      </>
    )
}