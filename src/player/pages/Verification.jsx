import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import "../css/verification.css"

export default function Verification() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [bool, setBool] = useState(null);
    const inputRefs = useRef([]);

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        const invalidChar = ["e", "E", "+", ".", "-"];
        if (invalidChar.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleChange = (index, value) => {
        const val = value.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const verify = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp: otp.join(""), id })
            });
            const data = await res.json();
            setBool(data);
            if (data === true) {
                navigate("/login");
            }
        } catch {
            console.error("Verification error occurred");
            setBool(false);
        }
    };

    return (
        <div className="veri_container">
            <div className="box">
                <h2>almost there</h2>
                <p className="txt">Enter your OTP which we have sent your registered Email </p>
                <div className="otp">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            maxLength={1}
                            className="nm"
                            type="text"
                            inputMode="numeric"
                            placeholder="_"
                        />
                    ))}
                </div>
                {bool === false && <p className="show">verification failed</p>}
                <button onClick={verify}>Verify</button>
                <div className="inr_box">
                    <p className="request">Request to resend OTP in 01:23</p>
                </div>
            </div>
        </div>
    );
}