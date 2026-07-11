import styles from '../css/signup.module.css'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../compo/Logo.jsx'
import { useState, useEffect } from 'react'

//GOOGLE 0auth login
import { GoogleLogin } from '@react-oauth/google';


export default function Signup() {
    // const [ csrf, setCsrf ] = useState("");
    // const [userToken, setUserToken] = useState();

    const navigate = useNavigate();

    // function signup(){
    //     navigate("/signup/verification")
    // }

    // const handleChange = (e) => {
    //     let {name, value} = e.target; 
    //     setSignupdata((prev) => ({...prev, [name]:value}))   
    // }

    const send_signupdata = async (usertoken) => {
        console.log('send_signupdata called with token:', usertoken);
        // Token fetch karo
        const csrfRes = await fetch(`${import.meta.env.VITE_BASE_URL}/getcsrf`, {  credentials: 'include' });
        const csrfData = await csrfRes.json();
        console.log('csrf token from frontend:', csrfData.csrfToken);

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
            method:'POST',
            credentials: 'include',
            headers:{
                "Content-Type":"application/json",
                "x-csrf-token":`${csrfData.csrfToken}`
            },
            body:JSON.stringify({usertoken})
        });

        console.log('signup response status:', res.status);
        const data  = await res.json();
        console.log('signup response data:', data);
        // console.log(data);
        if(res.status === 409){
            console.log("user exist")
            navigate('/login');
        }
        
        if(res.status === 200){
            navigate(`/signup/player/${data}`)
        }
    }

// google 0auth

    const handleSuccess = (credentialResponse) => {
    console.log(`login successfull ${credentialResponse.credential}`);
    send_signupdata(credentialResponse.credential);
 }

   const handleError = () => {
    console.log('login failed');
   }

    return (
        <>
        <Logo />
        <div className={styles.login}>
            <div className={styles.card}>                
                <div>
                    <form className={styles.login_card} onSubmit={send_signupdata}>
                        <h2>Create Account</h2>
                     <p className={styles.txt}>Join the battle and prove you are the Legend</p> 
                     {/* <input type="name" name="pass" placeholder="name" className="data" />
                     <input type="email" name="pass" placeholder="email" className="data" />
                     <input type="password" name="pass" placeholder="Password" className="data" /> 
                     <label>BGMI details : </label>
                    <input type="text" name="ign"  placeholder="IGN(In Game name)" className="data" />
                    <input type="number" name="uid" placeholder="UID e.g., 5534351343" className="data" />                   */}
                   <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                    <div className={styles.info_box}>
                        <div className={styles.box}>
                            <div className={styles.icon}><i className="fa-solid fa-bolt-lightning" style={{"color": "rgb(64, 2, 243)", "font-size":"xx-large"}}></i></div>
                            <div className={styles.info}>
                                <h3>Fast & Easy</h3>
                                <p>One tap sign up with Google</p>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.icon}><i className="fa-solid fa-shield" style={{"color": "rgb(64, 2, 243)", "font-size":"xx-large"}}></i></div>
                            <div className={styles.info}>
                                <h3>Secure & Safe</h3>
                                <p>Your data is protected</p>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.icon}><i className="fa-solid fa-gift" style={{"color": "rgb(64, 2, 243)", "font-size":"xx-large"}}></i></div>
                            <div className={styles.info}>
                                <h3>Exclusive Access</h3>
                                <p>Get access to tournaments</p>
                            </div>
                        </div>
                    </div>
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
