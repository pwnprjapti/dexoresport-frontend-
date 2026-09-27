import { useState, useEffect, useRef } from "react";
import "../css/payment_modal.css";
import { FaCheckCircle, FaExclamationCircle, FaQrcode, FaShieldAlt, FaMobileAlt, FaSyncAlt } from "react-icons/fa";

export default function TournamentPaymentModal({ paymentData, onClose, onSuccess }) {
    const [status, setStatus] = useState("PENDING"); // 'PENDING' | 'SUCCESS' | 'FAILED'
    const [statusMessage, setStatusMessage] = useState("Waiting for payment... Scan QR code with any UPI app.");
    const [verifying, setVerifying] = useState(false);
    const pollTimerRef = useRef(null);

    const checkPaymentStatus = async (isManual = false) => {
        if (!paymentData?.orderId) return;

        try {
            if (isManual) setVerifying(true);
            const token = localStorage.getItem("jwt");

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/check-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ orderId: paymentData.orderId })
            });

            const data = await res.json();

            if (data.status === "SUCCESS") {
                setStatus("SUCCESS");
                setStatusMessage("Payment Verified! Your tournament slot has been booked.");
                if (pollTimerRef.current) clearInterval(pollTimerRef.current);
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 2200);
            } else if (data.status === "FAILED") {
                setStatus("FAILED");
                setStatusMessage(data.message || "Payment verification failed or expired.");
                if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            } else {
                if (isManual) {
                    setStatusMessage("Payment still pending. Please complete transaction on UPI app.");
                }
            }
        } catch (err) {
            console.error("Status check error:", err);
        } finally {
            if (isManual) setVerifying(false);
        }
    };

    // Auto-poll status every 3.5 seconds
    useEffect(() => {
        pollTimerRef.current = setInterval(() => {
            checkPaymentStatus(false);
        }, 3500);

        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, [paymentData?.orderId]);

    if (!paymentData) return null;

    return (
        <div className="paymentModalBackdrop" onClick={onClose}>
            <div className="paymentModalCard" onClick={(e) => e.stopPropagation()}>
                <button className="modalCloseBtn" onClick={onClose} title="Close">
                    &times;
                </button>

                <div className="paymentHeader">
                    <div className="gatewayBadge">
                        <FaShieldAlt /> payment.ubresports.in Verified
                    </div>
                    <h2>Complete Registration</h2>
                    <div className="tournamentName">{paymentData.tournamentName || "Tournament Entry"}</div>
                    
                    <div className="organizerBox">
                        <span>Official Organizer:</span>
                        <strong>{paymentData.organizerName || "Tournament Organizer"}</strong>
                    </div>
                </div>

                <div className="amountBox">
                    <span>Entry Fee</span>
                    <div className="amountValue">₹{(paymentData.amount || 0).toLocaleString("en-IN")}</div>
                </div>

                {/* QR Code Frame */}
                <div className="qrContainer">
                    <div className="qrFrame">
                        <img
                            src={paymentData.qrCodeUrl}
                            alt="Organizer UPI QR Code"
                            className="qrImage"
                        />
                    </div>
                    <div className="qrScanHint">
                        Scan this QR code with any UPI application to pay directly to organizer.
                    </div>
                    <div className="supportedApps">
                        <span>PhonePe</span> • <span>Google Pay</span> • <span>Paytm</span> • <span>BHIM</span> • <span>CRED</span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div
                    className={`statusIndicator ${
                        status === "SUCCESS"
                            ? "statusSuccess"
                            : status === "FAILED"
                            ? "statusFailed"
                            : "statusPending"
                    }`}
                >
                    {status === "SUCCESS" && <FaCheckCircle />}
                    {status === "FAILED" && <FaExclamationCircle />}
                    {status === "PENDING" && <FaSyncAlt className="fa-spin" />}
                    <span>{statusMessage}</span>
                </div>

                {/* Action Buttons */}
                <div className="actionBtns">
                    {paymentData.upiIntent && (
                        <a
                            href={paymentData.upiIntent}
                            className="btnPayUpi"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaMobileAlt /> Pay via UPI App / Link
                        </a>
                    )}

                    <button
                        type="button"
                        className="btnVerify"
                        onClick={() => checkPaymentStatus(true)}
                        disabled={verifying || status === "SUCCESS"}
                    >
                        <FaQrcode /> {verifying ? "Verifying..." : "I Have Paid / Check Status"}
                    </button>
                </div>

                <div className="orderFooter">
                    <div>Order ID: <span>{paymentData.orderId}</span></div>
                    <div>Gateway: <span>ubresports.in</span></div>
                </div>
            </div>
        </div>
    );
}
