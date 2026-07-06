import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import "../css/verification.css"

export default function verfication() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [ otp, setOtp ] = useState([]);
    const [bool, setBool] = useState();

    const handlekeydown = (e) => {
        const invalidChar = ["e", "E", "+", ".", "-"]
        if(invalidChar.includes(e.key)){
            e.preventDefault();
            return;
        }
    }

    function handleChange(e){
          const { value} = e.target;
          setOtp((prev)=>([...prev, value]))
    }

    const verify = async () => {
        const res = await fetch('http://localhost:3000/verification', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({otp, id})
        });
        const data = await res.json();
        await setBool(data);
        console.log(bool)
    }

    return (
      <div className="veri_container">
       <div className="box">
        <h2>almost there</h2>
        <p className="txt">Enter your OTP which we have sent your registered Email </p>
        <div className="otp">
            <input onChange={handleChange} onKeyDown={(e)=>handlekeydown(e)} maxLength={1} onInput={(e) => {
        if(e.target.value.length > 1) {
            e.target.value = e.target.value.slice(0, 1);
        }
    }} className="nm" type="text" placeholder="_" />
            <input onChange={handleChange} onKeyDown={(e)=>handlekeydown(e)} maxLength={1} className="nm" type="number" placeholder="_" />
            <input onChange={handleChange} onKeyDown={(e)=>handlekeydown(e)} maxLength={1} className="nm"  type="number" placeholder="_" />
            <input onChange={handleChange} onKeyDown={(e)=>handlekeydown(e)} maxLength={1} className="nm" type="number" placeholder="_" />
        </div>
        <p style={{"display":"none" }} className={ bool ? navigate("/login") : "show"}>verfication failed </p>
        <button onClick={verify}>Verify</button>
        <div className="inr_box">
            <p className="request">Request to resend OTP in 01:23</p>
        </div>
       </div>
     </div>
    )
}