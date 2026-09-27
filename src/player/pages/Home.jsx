import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Nav from '../compo/nav.jsx'
import Footer from '../compo/Footer.jsx'
import Loading from '../compo/Loading.jsx'
import TournamentCard from '../compo/TournamentCard.jsx'
import '../css/App.css'
import '../css/Home.css'

// React Icons
import { 
  FaTrophy, 
  FaShieldAlt, 
  FaBolt, 
  FaUsers, 
  FaGamepad, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaStar, 
  FaPlus, 
  FaArrowRight, 
  FaCrown, 
  FaQrcode, 
  FaKey, 
  FaVideo, 
  FaTelegramPlane, 
  FaTimesCircle, 
  FaCheck,
  FaFireAlt,
  FaMedal,
  FaDiscord,
  FaHeadset
} from 'react-icons/fa'
import { IoFlame, IoGameController } from 'react-icons/io5'
import { useTenant } from '../../context/TenantContext.jsx'

export default function Home() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isTenant, tenantSlug, tenant } = useTenant();

    const [future, setFuture] = useState([]);
    const [live, setLive] = useState([]);
    const [past, setPast] = useState([]);
    
    // Interactive States
    const [activeTab, setActiveTab] = useState('all');
    const [activeGame, setActiveGame] = useState('all');
    const [activeFaq, setActiveFaq] = useState(0);

    const getTournaments = async () => {
        setLoading(true);
        try {
            const queryParam = tenantSlug ? `?org=${encodeURIComponent(tenantSlug)}` : '';
            const res_future = await fetch(`${import.meta.env.VITE_BASE_URL}/future${queryParam}`);
            const res_live = await fetch(`${import.meta.env.VITE_BASE_URL}/live${queryParam}`);
            const res_past = await fetch(`${import.meta.env.VITE_BASE_URL}/past${queryParam}`);

            const data_future = await res_future.json();
            const data_live = await res_live.json();
            const data_past = await res_past.json();

            setFuture(Array.isArray(data_future) ? data_future : []);
            setLive(Array.isArray(data_live) ? data_live : []);
            setPast(Array.isArray(data_past) ? data_past : []);
        } catch (err) {
            console.error("Error fetching tournaments:", err);
            setFuture([]);
            setLive([]);
            setPast([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTournaments();
    }, [tenantSlug]);

    // High-quality fallback demo tournaments if API is offline / database is empty
    const demoTournaments = [
      {
        _id: "demo-bgmi-1",
        tournament_name: "BGMI Ultimate Grand Showdown",
        prizepool: "5,000",
        first: "2,500",
        second: "1,200",
        third: "800",
        fourth: "500",
        map: "Erangel",
        team_format: "Squad",
        Team_size: "Squad",
        mode: "TPP",
        ttl_slots: 25,
        enteries: Array(21).fill(0),
        game: "bgmi",
        entryfee: 100,
        organization: "Dexor Official"
      },
      {
        _id: "demo-ff-1",
        tournament_name: "Free Fire Clash Squad Mega Cup",
        prizepool: "3,000",
        first: "1,500",
        second: "800",
        third: "500",
        fourth: "200",
        map: "Bermuda",
        team_format: "Squad",
        Team_size: "Squad",
        mode: "Clash",
        ttl_slots: 20,
        enteries: Array(17).fill(0),
        game: "freefire",
        entryfee: 50,
        organization: "HunterX Esports"
      },
      {
        _id: "demo-bgmi-2",
        tournament_name: "BGMI Miramar Sniper Havoc",
        prizepool: "2,000",
        first: "1,000",
        second: "500",
        third: "300",
        fourth: "200",
        map: "Miramar",
        team_format: "Duo",
        Team_size: "Duo",
        mode: "TPP",
        ttl_slots: 30,
        enteries: Array(28).fill(0),
        game: "bgmi",
        entryfee: 40,
        organization: "Dexor Pro Series"
      },
      {
        _id: "demo-valo-1",
        tournament_name: "Valorant Spike Rush Ignition",
        prizepool: "4,000",
        first: "2,400",
        second: "1,000",
        third: "600",
        fourth: "0",
        map: "Ascent",
        team_format: "5v5 Squad",
        Team_size: "Squad",
        mode: "Standard",
        ttl_slots: 16,
        enteries: Array(14).fill(0),
        game: "valorant",
        entryfee: 150,
        organization: "Viper League"
      }
    ];

    // Combine real and demo data
    const allTournamentsList = [...future, ...live, ...past];
    const displayList = allTournamentsList.length > 0 ? allTournamentsList : demoTournaments;

    // Filter tournaments based on tabs and game selection
    const filteredTournaments = displayList.filter(t => {
      const matchGame = activeGame === 'all' || (t.game && t.game.toLowerCase().includes(activeGame.toLowerCase()));
      if (!matchGame) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'live') return live.some(item => item._id === t._id);
      if (activeTab === 'upcoming') return future.some(item => item._id === t._id) || !past.some(item => item._id === t._id);
      if (activeTab === 'completed') return past.some(item => item._id === t._id);
      return true;
    });

    const playerFaqs = [
      {
        q: "How does the Dynamic UPI QR Slot Booking work?",
        a: "When you click 'Join Now' on any tournament, Dexor generates a dynamic, secure UPI QR code powered directly by payment.ubresports.in. Scan it with Google Pay, PhonePe, Paytm, or any UPI app. Once the transaction completes, your slot is instantly locked and confirmed on the leaderboard. No manual screenshot verification required!"
      },
      {
        q: "When and where do I receive the Room ID & Password?",
        a: "Your encrypted Room ID and Password will appear automatically on your match screen exactly 15 minutes before the match start time. In addition, you can opt to receive instant match reminders and credentials directly on Telegram through the Dexor Bot."
      },
      {
        q: "How does the Mandatory Anti-Cheat POV system protect players?",
        a: "To guarantee fair play and eliminate hackers, all winning squads and top performers are required to record and submit their in-game POV (point of view). Organizers and Dexor moderators review these recordings before prize distribution. Any verified hacker, emulator abuser, or script user is permanently banned."
      },
      {
        q: "How fast are prize pool winnings credited?",
        a: "Prize pools are credited directly to your registered UPI ID or Bank account within 15 minutes after match completion and POV verification. No waiting for days or dealing with unresponsive admins."
      },
      {
        q: "What happens if a match is cancelled or delayed?",
        a: "Your funds are 100% safe. If an organizer cancels a tournament, 100% of your entry fee is automatically refunded back to your source account or player wallet immediately."
      },
      {
        q: "Can I register as a Solo player or only as a full Squad?",
        a: "Dexor hosts Solo, Duo, and Squad tournaments across BGMI, Free Fire, Valorant, and COD Mobile. If you don't have a team, you can join Solo matches or use our Squad Matchmaker to team up with verified competitive players."
      }
    ];

    return (
      <div className="home-container">
        <Nav />

        {/* Ambient Glow Lights */}
        <div className="ambient-glow-top"></div>
        <div className="ambient-glow-mid"></div>
        <div className="ambient-glow-bottom"></div>

        {/* =========================================================
            PROMINENT TOP BANNER
            ========================================================= */}
        {isTenant ? (
          <div className="player-top-switch-bar" style={{ background: "rgba(0, 240, 255, 0.08)", borderColor: "rgba(0, 240, 255, 0.25)" }}>
            <div className="player-top-switch-inner">
              <span className="player-switch-text">
                <FaGamepad style={{ color: "#00f0ff", fontSize: "16px" }} />
                <strong>Welcome to {tenant?.organizationName || "Official Esports Arena"}</strong>
                <span className="player-switch-sub">{tenant?.tagline || "Competitive BGMI & Esports Tournaments Hub"}</span>
              </span>
              <span style={{ fontSize: "12px", color: "#00ff59", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
                <FaShieldAlt /> 100% Verified Org
              </span>
            </div>
          </div>
        ) : (
          <div className="player-top-switch-bar">
            <div className="player-top-switch-inner">
              <span className="player-switch-text">
                <FaCrown className="player-switch-crown" />
                <strong>Are you a Tournament Organizer, Clan Leader or Streamer?</strong>
                <span className="player-switch-sub">Automate entry collection, gateway QR & room dispatch.</span>
              </span>
              <Link to="/organizer" className="btn-switch-org">
                Switch to Organizer Portal <FaArrowRight />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================
            1. HERO SECTION (PLAYERS FOCUSED)
            ========================================================= */}
        <section className="hero-section">
          <div className="hero-live-pill">
            <span className="pulsing-dot"></span>
            <span className="pill-text">
              <span className="pill-highlight">LIVE ARENA:</span> {live.length > 0 ? `${live.length} MATCHES LIVE NOW` : "PRIZE POOL TOURNAMENTS ACTIVE TODAY"}
            </span>
          </div>

          <div className="hero-grid">
            <div className="hero-text-col">
              <div className="hero-subtitle-tag">
                <FaTrophy className="hero-tag-icon" style={{ color: "#ffd700", fontSize: "15px" }} />
                <span>{tenant?.organizationName ? `${tenant.organizationName.toUpperCase()} VERIFIED ESPORTS ARENA` : "INDIA'S #1 VERIFIED ESPORTS TOURNAMENT ARENA"}</span>
              </div>

              <h1 className="hero-title">
                {tenant?.organizationName ? (
                  <>
                    {tenant.organizationName.toUpperCase()} <br />
                    <span className="gradient-text-hero">COMPETE & WIN REAL CASH.</span>
                  </>
                ) : (
                  <>
                    LEVEL UP YOUR GAME. <br />
                    <span className="gradient-text-hero">COMPETE & WIN REAL CASH.</span>
                  </>
                )}
              </h1>

              <p className="hero-description">
                {tenant?.about || "Join India's premier competitive gaming ecosystem. Battle in verified BGMI, Free Fire MAX, and Valorant tournaments with 100% Anti-Cheat POV verification, instant dynamic UPI QR slot booking, and guaranteed 15-minute cashouts."}
              </p>

              {/* Action Buttons for Players */}
              <div className="hero-cta-group">
                <button 
                  className="btn-primary-glow"
                  onClick={() => navigate("/tournaments")}
                >
                  <FaGamepad /> Join Live Tournaments
                </button>
                <button 
                  className="btn-secondary-outline"
                  onClick={() => navigate("/leaderboard")}
                >
                  <FaTrophy /> View Leaderboard
                </button>
              </div>

              {/* Player Trust Badges */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <div className="stat-number">
                    <FaShieldAlt style={{ color: '#00f0ff', marginRight: '6px', fontSize: '20px' }} />
                    100%
                  </div>
                  <div className="stat-label">Anti-Cheat POV</div>
                </div>
                <div className="hero-stat-item">
                  <div className="stat-number">
                    <FaQrcode style={{ color: '#fe26f4', marginRight: '6px', fontSize: '20px' }} />
                    5-Sec
                  </div>
                  <div className="stat-label">UPI QR Booking</div>
                </div>
                <div className="hero-stat-item">
                  <div className="stat-number">
                    <FaBolt style={{ color: '#ffb703', marginRight: '6px', fontSize: '20px' }} />
                    15-Min
                  </div>
                  <div className="stat-label">Direct Cashouts</div>
                </div>
                <div className="hero-stat-item">
                  <div className="stat-number">
                    <FaKey style={{ color: '#2ec4b6', marginRight: '6px', fontSize: '20px' }} />
                    Auto
                  </div>
                  <div className="stat-label">Room ID & Pass</div>
                </div>
              </div>
            </div>

            {/* Right Visual Spotlight Card */}
            <div className="hero-visual-col">
              <div className="spotlight-card">
                <div className="spotlight-glow"></div>
                
                <div className="spotlight-badge">
                  <IoFlame style={{ color: '#fe26f4' }} /> FEATURED BATTLEGROUND
                </div>

                <div className="spotlight-img-wrap">
                  <img 
                    src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780491913/7f08f83034ceae43bb95a3ba2e8b2bf3_v4n1pt.jpg" 
                    alt="Competitive Gaming Showcase" 
                    className="spotlight-img"
                  />
                  <div className="spotlight-overlay"></div>
                </div>

                <div className="spotlight-meta">
                  <div className="spotlight-title">BGMI Pro League Championship</div>
                  <div className="spotlight-tags">
                    <span className="spotlight-tag">SQUAD TPP</span>
                    <span className="spotlight-tag">ERANGEL</span>
                    <span className="spotlight-tag prize-tag">PRIZE: ₹10,000</span>
                  </div>
                  <button 
                    className="spotlight-join-btn"
                    onClick={() => navigate("/tournaments")}
                  >
                    Lock Your Squad Slot <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. WHY JOIN DEXOR ESPORTS AS A PLAYER? (CORE VALUE SECTION)
            ========================================================= */}
        <section className="section-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header-centered">
            <div className="section-eyebrow">
              <FaShieldAlt style={{ color: '#00f0ff' }} /> UNRIVALED COMPETITIVE EXPERIENCE
            </div>
            <h2 className="section-title-large">
              WHY COMPETE ON <span className="gradient-text-alt">DEXOR ESPORTS?</span>
            </h2>
            <p className="section-subtitle">
              Say goodbye to scam scrims, unverified WhatsApp admins, and delayed prize payouts. Dexor provides the most transparent, automated, and secure esports platform built specifically for Indian gamers.
            </p>
          </div>

          <div className="features-grid-3col">
            {/* Superpower 1 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(0, 240, 255, 0.15)', borderColor: '#00f0ff' }}>
                <FaShieldAlt style={{ color: '#00f0ff' }} />
              </div>
              <h3 className="feature-card-title">100% Anti-Cheat POV Verification</h3>
              <p className="feature-card-desc">
                Zero tolerance for hackers, scripts, or emulator abuse. All top-ranking teams must submit mandatory screen recordings (POV) before receiving prize payouts. Play with peace of mind.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#00f0ff', fontWeight: 'bold' }}>
                ✓ Fair Play Assured • Manual Admin Review
              </div>
            </div>

            {/* Superpower 2 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(254, 38, 244, 0.15)', borderColor: '#fe26f4' }}>
                <FaQrcode style={{ color: '#fe26f4' }} />
              </div>
              <h3 className="feature-card-title">Dynamic UPI QR Slot Booking</h3>
              <p className="feature-card-desc">
                Scan and lock your squad slot in under 5 seconds with Google Pay, PhonePe, Paytm, or BHIM. Zero payment gateway errors and no manual screenshot confirmation hassles.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#fe26f4', fontWeight: 'bold' }}>
                ✓ Instant Confirmation • Powered by payment.ubresports.in
              </div>
            </div>

            {/* Superpower 3 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(255, 183, 3, 0.15)', borderColor: '#ffb703' }}>
                <FaBolt style={{ color: '#ffb703' }} />
              </div>
              <h3 className="feature-card-title">Guaranteed 15-Minute Cashouts</h3>
              <p className="feature-card-desc">
                Win your match, verify your score, and receive your prize money directly to your UPI ID or Bank Account within 15 minutes. No endless waiting or admin excuses.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#ffb703', fontWeight: 'bold' }}>
                ✓ Instant UPI Settlement • 100% Payout Record
              </div>
            </div>

            {/* Superpower 4 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(46, 196, 182, 0.15)', borderColor: '#2ec4b6' }}>
                <FaKey style={{ color: '#2ec4b6' }} />
              </div>
              <h3 className="feature-card-title">Automated Room ID & Password</h3>
              <p className="feature-card-desc">
                No more asking "bhai room ID kab milega?" in chaotic WhatsApp groups. Room credentials appear directly on your dashboard and private Telegram 15 minutes before drop time.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#2ec4b6', fontWeight: 'bold' }}>
                ✓ Encrypted Delivery • Telegram Bot Alerts
              </div>
            </div>

            {/* Superpower 5 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(57, 57, 255, 0.15)', borderColor: '#3939ff' }}>
                <FaGamepad style={{ color: '#3939ff' }} />
              </div>
              <h3 className="feature-card-title">Daily Multi-Game Scrims</h3>
              <p className="feature-card-desc">
                High-octane matches running every hour across BGMI, Free Fire MAX, Valorant, and COD Mobile. Solo, Duo, and Squad formats with customized maps and rulesets.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#3939ff', fontWeight: 'bold' }}>
                ✓ Tier 1/2/3 Scrims • Custom Tournaments
              </div>
            </div>

            {/* Superpower 6 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(230, 57, 70, 0.15)', borderColor: '#e63946' }}>
                <FaTrophy style={{ color: '#e63946' }} />
              </div>
              <h3 className="feature-card-title">Leaderboards & Esports Scouting</h3>
              <p className="feature-card-desc">
                Build your verified competitive profile, track your kills and finishes, climb national rank ladders, and get discovered by official Tier-1 esports organizations.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#e63946', fontWeight: 'bold' }}>
                ✓ Official Gamer Resume • Verified Player Badges
              </div>
            </div>

            {/* Superpower 7 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(114, 9, 183, 0.15)', borderColor: '#7209b7' }}>
                <FaUsers style={{ color: '#7209b7' }} />
              </div>
              <h3 className="feature-card-title">Squad Hub & Teammate Finder</h3>
              <p className="feature-card-desc">
                Connect with serious competitive players of your rank. Form your 4-man roster, register your entire clan in one click, and manage team members effortlessly.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#7209b7', fontWeight: 'bold' }}>
                ✓ 1-Click Roster Registration • Clan Battles
              </div>
            </div>

            {/* Superpower 8 */}
            <div className="ecosystem-card">
              <div className="feature-icon-badge" style={{ background: 'rgba(0, 180, 216, 0.15)', borderColor: '#00b4d8' }}>
                <FaHeadset style={{ color: '#00b4d8' }} />
              </div>
              <h3 className="feature-card-title">100% Refund & Dispute Shield</h3>
              <p className="feature-card-desc">
                Your entry fees are always protected. If an organizer cancels or delays a match beyond reasonable time, your money is automatically refunded back to your account immediately.
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#00b4d8', fontWeight: 'bold' }}>
                ✓ Zero Risk • 24/7 Match Support
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. MESSY WHATSAPP SCRIMS VS DEXOR ESPORTS (COMPARISON TABLE)
            ========================================================= */}
        <section className="section-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header-centered">
            <div className="section-eyebrow">
              <IoFlame style={{ color: '#fe26f4' }} /> THE BRUTAL TRUTH
            </div>
            <h2 className="section-title-large">
              MESSY WHATSAPP SCRIMS <span className="gradient-text-hero">VS DEXOR ESPORTS</span>
            </h2>
            <p className="section-subtitle">
              See why over 50,000+ competitive players have abandoned shady WhatsApp groups to play exclusively on Dexor.
            </p>
          </div>

          <div className="matrix-table-wrap">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Features & Experience</th>
                  <th style={{ width: '35%', color: '#ff4d4d' }}>❌ Chaotic WhatsApp / Discord Groups</th>
                  <th style={{ width: '35%', color: '#00f0ff' }}>⚡ Dexor Esports Platform</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Slot Booking & Payment</strong></td>
                  <td style={{ color: '#ff8585' }}>Send payment screenshot, wait hours for reply, risk fake UTR fraud.</td>
                  <td style={{ color: '#4ade80' }}><strong>Instant Dynamic UPI QR code.</strong> Slot locks in 5 seconds automatically.</td>
                </tr>
                <tr>
                  <td><strong>Room ID & Password Delivery</strong></td>
                  <td style={{ color: '#ff8585' }}>Spammed in messy WhatsApp chats, leaked to random players, delayed start.</td>
                  <td style={{ color: '#4ade80' }}><strong>Encrypted on your screen & Telegram</strong> exactly 15 mins before match.</td>
                </tr>
                <tr>
                  <td><strong>Anti-Cheat & Fair Play</strong></td>
                  <td style={{ color: '#ff8585' }}>Admins ignore hacker reports or favor their friends' teams.</td>
                  <td style={{ color: '#4ade80' }}><strong>Mandatory POV screen recording submission.</strong> Instant bans for cheats.</td>
                </tr>
                <tr>
                  <td><strong>Prize Pool Payouts</strong></td>
                  <td style={{ color: '#ff8585' }}>Days of delays, excuses, or organizer completely ghosts the group.</td>
                  <td style={{ color: '#4ade80' }}><strong>Direct UPI payout within 15 minutes</strong> of match verification.</td>
                </tr>
                <tr>
                  <td><strong>Match Cancellation & Refunds</strong></td>
                  <td style={{ color: '#ff8585' }}>Organizers rarely refund money when matches get cancelled.</td>
                  <td style={{ color: '#4ade80' }}><strong>100% Instant Automated Refund</strong> credited directly back to you.</td>
                </tr>
                <tr>
                  <td><strong>Career & Stats Tracking</strong></td>
                  <td style={{ color: '#ff8585' }}>Zero record. Your victories are forgotten the next day.</td>
                  <td style={{ color: '#4ade80' }}><strong>Permanent gamer profile</strong>, K/D stats, rank badges, and public leaderboard.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================================================
            4. HOW TO COMPETE & WIN IN 4 EASY STEPS (PLAYER ROADMAP)
            ========================================================= */}
        <section className="section-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header-centered">
            <div className="section-eyebrow">
              <FaBolt style={{ color: '#00f0ff' }} /> SIMPLE & SEAMLESS
            </div>
            <h2 className="section-title-large">
              HOW TO PLAY & WIN <span className="gradient-text-alt">IN 4 SIMPLE STEPS</span>
            </h2>
            <p className="section-subtitle">
              Jump from browsing to battling in under 60 seconds. Here is how easy it is to compete on Dexor.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-badge" style={{ color: '#00f0ff' }}>STEP 1</div>
              <h3 className="step-title">Choose Your Battle</h3>
              <p className="step-desc">
                Browse through daily scrims and high-stakes tournaments for BGMI, Free Fire, Valorant, or CODM. Pick your preferred map, mode, and entry fee.
              </p>
            </div>

            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-badge" style={{ color: '#fe26f4' }}>STEP 2</div>
              <h3 className="step-title">Scan Dynamic UPI QR</h3>
              <p className="step-desc">
                Scan the secure dynamic UPI QR code with GPay, PhonePe, or Paytm. Your squad's slot is instantly confirmed without sending manual screenshots.
              </p>
            </div>

            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-badge" style={{ color: '#ffb703' }}>STEP 3</div>
              <h3 className="step-title">Receive Room Credentials</h3>
              <p className="step-desc">
                Exactly 15 minutes before the match drops, your encrypted Room ID and Password will display on your screen and arrive via Telegram.
              </p>
            </div>

            <div className="step-card">
              <div className="step-num">04</div>
              <div className="step-badge" style={{ color: '#2ec4b6' }}>STEP 4</div>
              <h3 className="step-title">Conquer & Get Cashout</h3>
              <p className="step-desc">
                Dominate the battleground, upload your winning POV, and receive your prize cash directly into your UPI account within 15 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. LIVE & FEATURED TOURNAMENTS PREVIEW
            ========================================================= */}
        <section className="section-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header-centered">
            <div className="section-eyebrow">
              <IoGameController style={{ color: '#00f0ff' }} /> ACTIVE BATTLEGROUNDS
            </div>
            <h2 className="section-title-large">
              FEATURED & LIVE <span className="gradient-text-hero">TOURNAMENTS</span>
            </h2>
            <p className="section-subtitle">
              Slots fill up fast! Pick your battleground below and reserve your squad's slot now.
            </p>
          </div>

          {/* Game Selection Filters */}
          <div className="filter-pill-bar">
            {[
              { id: 'all', label: 'All Games' },
              { id: 'bgmi', label: 'BGMI' },
              { id: 'freefire', label: 'Free Fire MAX' },
              { id: 'valorant', label: 'Valorant' },
              { id: 'codm', label: 'Call of Duty' }
            ].map(g => (
              <button
                key={g.id}
                className={`filter-pill ${activeGame === g.id ? 'active' : ''}`}
                onClick={() => setActiveGame(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Tournaments Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Loading />
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="tournaments-cards-grid">
              {filteredTournaments.slice(0, 6).map((tour) => (
                <TournamentCard key={tour._id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="empty-tournaments-box">
              <FaGamepad style={{ fontSize: '48px', color: '#a0a3b5', marginBottom: '15px' }} />
              <h3>No tournaments found for this game right now</h3>
              <p>Check back in a few minutes or view all available matches.</p>
              <button 
                className="btn-primary-glow" 
                style={{ marginTop: '15px' }}
                onClick={() => { setActiveGame('all'); setActiveTab('all'); }}
              >
                Reset Filters
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              className="btn-primary-glow"
              onClick={() => navigate("/tournaments")}
              style={{ padding: '14px 35px', fontSize: '16px' }}
            >
              Explore All Available Tournaments ({displayList.length}) <FaArrowRight />
            </button>
          </div>
        </section>

        {/* =========================================================
            6. PLAYER TESTIMONIALS & COMMUNITY REVIEWS
            ========================================================= */}
        <section className="section-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header-centered">
            <div className="section-eyebrow">
              <FaStar style={{ color: '#ffb703' }} /> TESTED BY PROS
            </div>
            <h2 className="section-title-large">
              HEAR FROM THE <span className="gradient-text-alt">GAMING COMMUNITY</span>
            </h2>
            <p className="section-subtitle">
              Thousands of daily scrim players, clan leaders, and competitive esports athletes trust Dexor.
            </p>
          </div>

          <div className="features-grid-3col">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-quote">
                "We used to get scammed on WhatsApp scrims regularly where admins disappeared after taking entry fees. On Dexor, our prize money was credited to UPI in 12 minutes after winning Erangel. 100% legit platform!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-cyan">
                  SK
                </div>
                <div className="author-info">
                  <h4 className="author-name">ShadowKnight (Viper Esports)</h4>
                  <small className="author-sub text-cyan">BGMI IGL • 42 Tournaments Won</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-quote">
                "The mandatory POV anti-cheat submission makes all the difference. No more magic bullets or emulator hackers ruining our Free Fire Clash Squad matches. If you cheat, you don't get paid. Perfect!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-pink">
                  RD
                </div>
                <div className="author-info">
                  <h4 className="author-name">RedDragon Clan</h4>
                  <small className="author-sub text-pink">Free Fire MAX • Clan Leader</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-quote">
                "Scanning the UPI QR to lock our slot takes literally 5 seconds, and Room ID comes straight to our screen and Telegram. Never having to beg an admin for room credentials again is a blessing."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-gold">
                  MX
                </div>
                <div className="author-info">
                  <h4 className="author-name">Matrix_OP</h4>
                  <small className="author-sub text-gold">Valorant & CODM Assaulter</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. PLAYER FREQUENTLY ASKED QUESTIONS
            ========================================================= */}
        <section className="section-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header-centered">
            <div className="section-eyebrow">
              <FaShieldAlt style={{ color: '#00f0ff' }} /> GOT QUESTIONS?
            </div>
            <h2 className="section-title-large">
              FREQUENTLY ASKED <span className="gradient-text-hero">QUESTIONS</span>
            </h2>
            <p className="section-subtitle">
              Everything competitive players need to know about competing, payments, and anti-cheat on Dexor.
            </p>
          </div>

          <div className="faq-container">
            {playerFaqs.map((faq, index) => (
              <div 
                key={index}
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            8. FINAL PLAYER CALL TO ACTION BANNER
            ========================================================= */}
        <section className="section-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="cta-banner">
            <div className="cta-banner-content">
              <div className="cta-eyebrow">
                <IoFlame style={{ color: '#ffb703' }} /> YOUR TIME HAS COME
              </div>
              <h2 className="cta-title">
                READY TO DOMINATE THE BATTLEFIELD?
              </h2>
              <p className="cta-desc">
                Create your player account in 30 seconds, pick a tournament, and show the esports world what your squad is made of.
              </p>

              <div className="cta-buttons">
                <button 
                  className="btn-primary-glow"
                  onClick={() => navigate("/tournaments")}
                  style={{ padding: '16px 36px', fontSize: '16px' }}
                >
                  <FaGamepad /> Join Next Tournament
                </button>
                <button 
                  className="btn-secondary-outline"
                  onClick={() => navigate("/signup")}
                  style={{ padding: '16px 36px', fontSize: '16px' }}
                >
                  <FaUsers /> Create Free Gamer Account
                </button>
              </div>

              {/* Sub-banner link to Organizer Portal */}
              <div style={{ marginTop: '35px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ color: '#a0a3b5', fontSize: '14px', marginRight: '10px' }}>
                  Are you an esports clan or tournament organizer?
                </span>
                <Link 
                  to="/organizer" 
                  style={{ 
                    color: '#fe26f4', 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  Host tournaments with our Automated Organizer Hub <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
}