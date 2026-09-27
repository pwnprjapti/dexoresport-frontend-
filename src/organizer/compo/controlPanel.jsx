import { Link } from "react-router-dom"
import styles from "../css/controlPanel.module.css"
import { useState } from "react"

export default function ControlPanel(){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
         {/* Top Navigation Bar for Mobile */}
         <div className={styles.topNav}>
             {/* Left side: Branding Logo */}
             <div className={styles.topNavLogo}>
                 <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Logo" />
             </div>

             {/* Right side: Circular Profile Toggle Button */}
             <div className={styles.profileBtn} onClick={() => setIsOpen(!isOpen)}>
                 <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780488368/c8d7aXD4SvWCL8_CMb5ZDQ_tmvj49.webp" alt="Profile" />
             </div>
         </div>

         {/* Sidebar Control Panel */}
         <div className={`${styles.controlPanel} ${isOpen ? styles.active : ''}`}>
            <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Logo" />

            <div className={styles.buttons}>
                <Link to="/organizer/overview" onClick={() => setIsOpen(false)}>Overview</Link>
                <Link to="/organizer/tournaments" onClick={() => setIsOpen(false)}>Tournaments</Link>
                <Link to="/organizer/addtournament" onClick={() => setIsOpen(false)}>Create Tournament</Link>
                <Link to="/organizer/integrations" onClick={() => setIsOpen(false)}>Integrations</Link>
                <Link to="/organizer/wallet" onClick={() => setIsOpen(false)}>Wallet</Link>
                <Link to="/organizer/transactions" onClick={() => setIsOpen(false)}>Transactions</Link>
                <Link to="/organizer/analytics" onClick={() => setIsOpen(false)}>Analytics</Link>
                <Link to="/organizer/reviews" onClick={() => setIsOpen(false)}>Reviews</Link>
                <Link to="/organizer/dashboard" onClick={() => setIsOpen(false)}>Profile</Link>
                <Link to="/organizer/settings" onClick={() => setIsOpen(false)}>Settings</Link>

                <div className={styles.support}>
                    <h2>Need Help ?</h2>
                    <p>We're here to help</p>
                    <button>Contact Support</button>
                </div>
            </div>
         </div>

         {/* Overlay backdrop when menu is open on mobile */}
         {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>}
        </>
    )
}