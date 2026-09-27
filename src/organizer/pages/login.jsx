import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "../css/login.module.css"
import Toaster from "../compo/toaster";
import Loading from "../compo/Loading";

export default function Login(){

  const navigate = useNavigate();

   const [ data, setData ] = useState({ email:"", password:""});
   const [ loading, setLoading ] = useState(true);

    const [ color, setColor ] = useState();
    const [ bg, setBg ] = useState();
    const [ border, setBorder ] = useState();
    const [ tmsg, setTmsg ] = useState();
    const [ visible, setVisible ] = useState("none");

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const toast = (color, bg, border, tmsg) => {
           setTmsg(tmsg);
            setBorder(border);
            setBg(bg);
            setColor(color);
           setVisible("block");

            setTimeout(()=>{
              setVisible("none");
            }, 2000);
  }

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData((prev)=>({...prev, [name]:value}));
   }

   const handleSubmit = async (e) =>{
     e.preventDefault();
     setLoading(true);
     
     try {
       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/login`, {
         method:"POST",
         headers:{
           "Content-Type":"application/json"
         },
         body:JSON.stringify(data)
       });

       const resdata = await res.json();

       if(res.status === 404){
             toast("yellow", "rgba(238, 255, 0, 0.27)", "yellow", resdata.msg);
             setLoading(false);
       }

       if(res.status === 401){
             toast("red", "rgba(255, 0, 0, 0.272)", "red", resdata.msg);
             setLoading(false);
       }

       if(res.status === 200){
           localStorage.setItem("jwt", resdata.token);
            
            toast("rgb(0, 255, 89)", "rgba(0, 255, 89, 0.24)", "rgb(0, 255, 89)", resdata.msg);
            setTimeout(()=>{
             navigate("/organizer/dashboard");
            }, 1500);
       }
     } catch (err) {
       console.error(err);
       setLoading(false);
     }
   }

   if (loading) {
       return <Loading />;
   }

    return(
      <div className={styles.container}>
        <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" />
        <h1>Welcome <span>Back!</span></h1>
        <p>Login to your <span>organizer</span> account and continue hosting amazing tournaments.</p>
        <div className={styles.box}>
                <input type="email" onChange={handleChange} name="email" placeholder="Email" />
                <input type="password" onChange={handleChange} name="password" placeholder="Enter a Strong Password"/>
                <small><Link to="#">Forgot Password ?</Link></small>
                <Toaster tmsg={tmsg} color={color} bg={bg} border={border} visible={visible} />
                <button onClick={handleSubmit}>Login as Organizer</button>
                <p>Don't have an account ? <Link to="/organizer/signup">Sign Up</Link></p>
       </div>
     </div>
    )
}