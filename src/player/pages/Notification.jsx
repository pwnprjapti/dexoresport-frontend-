import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../compo/nav.jsx'
import Footer from '../compo/Footer.jsx'
import '../css/notification.css'

// React Icons
import { 
  FaTrophy, 
  FaCheckCircle, 
  FaCoins, 
  FaBullhorn, 
  FaMedal, 
  FaShieldAlt, 
  FaClock, 
  FaCheckDouble, 
  FaTrashAlt, 
  FaExclamationTriangle,
  FaTools
} from 'react-icons/fa'
import { IoGameController, IoFlame } from 'react-icons/io5'

function formatAnnouncementTime(dateStr) {
  if (!dateStr) return "Recently";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function Notification() {
  const [activeTab, setActiveTab] = useState('all')
  const [liveAnnouncements, setLiveAnnouncements] = useState([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/public/announcements`)
        const data = await res.json()
        if (data.success && Array.isArray(data.announcements)) {
          const filtered = data.announcements.filter(
            (a) => a.active !== false && (a.target === 'all' || a.target === 'players')
          )
          setLiveAnnouncements(filtered)
        }
      } catch (err) {
        console.error("Error loading live broadcasts:", err)
      }
    }
    fetchAnnouncements()
  }, [])

  const urgentCount = liveAnnouncements.filter((a) => a.priority === 'urgent').length

  return (
    <>
      <Nav />

      <div className="notification-container">
        {/* Header */}
        <div className="notif-header">
          <div className="notif-title-area">
            <h1>Notifications <span>& System Alerts</span></h1>
            {urgentCount > 0 ? (
              <span className="notif-badge-count">{urgentCount} URGENT</span>
            ) : (
              <span className="notif-badge-count">{liveAnnouncements.length + 3} NEW</span>
            )}
          </div>

          <div className="notif-actions">
            <button className="notif-btn-secondary" title="Mark all notifications as read">
              <FaCheckDouble /> Mark All Read
            </button>
            <button className="notif-btn-secondary" title="Clear non-urgent alerts">
              <FaTrashAlt /> Clear All
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="notif-tabs">
          <button 
            className={`notif-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Notifications ({liveAnnouncements.length + 6})
          </button>
          <button 
            className={`notif-tab ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System & Broadcasts ({liveAnnouncements.length + 2})
          </button>
          <button 
            className={`notif-tab ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            Tournaments (3)
          </button>
          <button 
            className={`notif-tab ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            Rewards & Wallet (1)
          </button>
        </div>

        {/* Notification Items List */}
        <div className="notif-list">

          {/* DYNAMIC: LIVE BROADCASTS FROM MASTER ADMIN */}
          {(activeTab === 'all' || activeTab === 'system') && (
            liveAnnouncements.map((ann) => {
              const isUrgent = ann.priority === 'urgent'
              const isHigh = ann.priority === 'high'
              const cardClass = isUrgent ? 'notif-card unread-urgent' : isHigh ? 'notif-card unread-reward' : 'notif-card unread'
              const iconClass = isUrgent ? 'notif-icon-box icon-urgent' : ann.category === 'maintenance' ? 'notif-icon-box icon-security' : 'notif-icon-box icon-announcement'

              return (
                <div key={ann._id} className={cardClass}>
                  <div className={iconClass}>
                    {isUrgent ? <FaExclamationTriangle /> : ann.category === 'maintenance' ? <FaTools /> : <FaBullhorn />}
                  </div>
                  <div className="notif-content">
                    <div className="notif-top-row">
                      <span className={`notif-tag ${isUrgent ? 'tag-urgent' : isHigh ? 'tag-reward' : 'tag-announcement'}`}>
                        {isUrgent ? '🚨 URGENT OFFICIAL BROADCAST' : ann.category === 'maintenance' ? '🛠️ SERVER MAINTENANCE' : '📢 SYSTEM BROADCAST'}
                      </span>
                      <span className="notif-time"><FaClock /> {formatAnnouncementTime(ann.createdAt)}</span>
                    </div>
                    <h3>{ann.title}</h3>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#e2e8f0" }}>
                      {ann.content}
                    </p>
                    <div className="notif-details-box">
                      <div><span>Published By:</span> <strong>{ann.author || 'Dexor Master Admin'}</strong></div>
                      <div><span>Target Audience:</span> <strong style={{ textTransform: "uppercase" }}>{ann.target || 'ALL'}</strong></div>
                      <div><span>Priority:</span> <strong style={{ textTransform: "uppercase", color: isUrgent ? '#ff3366' : isHigh ? '#ffaa00' : '#00f0ff' }}>{ann.priority || 'NORMAL'}</strong></div>
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* 1. URGENT LIVE MATCH ALERT (Unread) */}
          {(activeTab === 'all' || activeTab === 'tournaments') && (
            <div className="notif-card unread-urgent">
              <div className="notif-icon-box icon-urgent">
                <IoFlame />
              </div>
              <div className="notif-content">
                <div className="notif-top-row">
                  <span className="notif-tag tag-urgent">Match Starting Soon • BGMI</span>
                  <span className="notif-time"><FaClock /> 12 mins ago</span>
                </div>
                <h3>Room Details Released: BGMI Grand Finals Slot #14</h3>
                <p>
                  Your match in the <strong>Dexor Pro Cup 2026</strong> is starting in 15 minutes!
                  Your squad <em>'Shadow Ninjas'</em> has been assigned to Slot #14. Enter the custom room credentials immediately.
                </p>
                <div className="notif-details-box">
                  <div><span>Room ID:</span> <strong>8942103</strong></div>
                  <div><span>Password:</span> <strong>dxr#bgmi26</strong></div>
                  <div><span>Map:</span> <strong>Erangel (Squad)</strong></div>
                  <div><span>Start Time:</span> <strong>08:30 PM IST</strong></div>
                </div>
                <div className="notif-footer">
                  <Link to="/tournaments" className="notif-action-btn">
                    <IoGameController /> Join Custom Room
                  </Link>
                  <button className="notif-action-btn btn-outline" onClick={() => alert("Room ID: 8942103, Pass: dxr#bgmi26 copied!")}>
                    Copy Credentials
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. REGISTRATION CONFIRMED (Unread) */}
          {(activeTab === 'all' || activeTab === 'tournaments') && (
            <div className="notif-card unread">
              <div className="notif-icon-box icon-tournament">
                <FaCheckCircle />
              </div>
              <div className="notif-content">
                <div className="notif-top-row">
                  <span className="notif-tag tag-tournament">Registration Confirmed</span>
                  <span className="notif-time"><FaClock /> 2 hours ago</span>
                </div>
                <h3>Registration Confirmed for Free Fire Squad Clash</h3>
                <p>
                  Your registration for <strong>Free Fire Max Weekend Battle</strong> has been confirmed. Your team slot has been locked.
                </p>
                <div className="notif-details-box">
                  <div><span>Tournament ID:</span> <strong>#DX-FF-902</strong></div>
                  <div><span>Team:</span> <strong>Vortex Phoenix</strong></div>
                  <div><span>Slots Filled:</span> <strong>48 / 50</strong></div>
                </div>
                <div className="notif-footer">
                  <Link to="/tournaments" className="notif-action-btn">
                    View Tournament Details
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 3. REWARD / PRIZE MONEY CREDITED (Unread) */}
          {(activeTab === 'all' || activeTab === 'rewards') && (
            <div className="notif-card unread-reward">
              <div className="notif-icon-box icon-reward">
                <FaCoins />
              </div>
              <div className="notif-content">
                <div className="notif-top-row">
                  <span className="notif-tag tag-reward">Prize Money Credited</span>
                  <span className="notif-time"><FaClock /> Yesterday at 09:15 PM</span>
                </div>
                <h3>₹2,500 Won! Valorant 5v5 Championship</h3>
                <p>
                  Congratulations! Your team secured <strong>Rank #1 (Champions)</strong> in the Valorant Community Showdown.
                  Your prize money ₹2,500 has been credited directly to your Dexor Esports wallet balance.
                </p>
                <div className="notif-details-box">
                  <div><span>Prize Amount:</span> <strong>₹2,500.00 INR</strong></div>
                  <div><span>Status:</span> <strong>Credited (Available to Withdraw)</strong></div>
                </div>
                <div className="notif-footer">
                  <Link to="/profile" className="notif-action-btn btn-gold">
                    <FaTrophy /> Check Wallet & Rewards
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 4. LEADERBOARD RANK UP (Read) */}
          {(activeTab === 'all' || activeTab === 'system') && (
            <div className="notif-card">
              <div className="notif-icon-box icon-achievement">
                <FaMedal />
              </div>
              <div className="notif-content">
                <div className="notif-top-row">
                  <span className="notif-tag tag-achievement">New Rank Milestone</span>
                  <span className="notif-time"><FaClock /> 3 days ago</span>
                </div>
                <h3>You Ranked in the Top 10 on Global Leaderboard!</h3>
                <p>
                  Awesome skills! Following your recent tournament victory, your overall rating increased by <strong>+65 MMR</strong>. You are now ranked <strong>#8</strong> among all Dexor Esports verified players.
                </p>
                <div className="notif-footer">
                  <Link to="/leaderboard" className="notif-action-btn btn-outline">
                    View Global Leaderboards
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 5. SECURITY ALERT (Read) */}
          {(activeTab === 'all' || activeTab === 'system') && (
            <div className="notif-card">
              <div className="notif-icon-box icon-security">
                <FaShieldAlt />
              </div>
              <div className="notif-content">
                <div className="notif-top-row">
                  <span className="notif-tag tag-security">Security & Account</span>
                  <span className="notif-time"><FaClock /> 5 days ago</span>
                </div>
                <h3>New Device Login Detected</h3>
                <p>
                  Your Dexor Esports account was successfully logged in from <strong>Chrome on Windows 11</strong> (Location: Delhi, India).
                </p>
                <div className="notif-details-box">
                  <div><span>IP Address:</span> <strong>103.241.11.89</strong></div>
                  <div><span>Time:</span> <strong>03 Aug 2026, 11:20 AM</strong></div>
                </div>
                <div className="notif-footer">
                  <Link to="/profile" className="notif-action-btn btn-outline">
                    Manage Security
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  )
}
