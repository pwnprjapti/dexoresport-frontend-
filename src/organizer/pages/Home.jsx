import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/OrganizerLanding.css";

// React Icons
import {
  FaRocket,
  FaQrcode,
  FaKey,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaTelegramPlane,
  FaCrown,
  FaArrowRight,
  FaMoneyBillWave,
  FaCheckCircle,
  FaCalculator,
  FaGamepad,
  FaStar,
  FaLock,
  FaRegClock,
  FaLayerGroup,
  FaCheck,
  FaTimes,
  FaGlobe
} from "react-icons/fa";
import { IoFlame, IoFlash, IoShieldCheckmark } from "react-icons/io5";

export default function OrganizerHome() {
  const navigate = useNavigate();

  // Pricing / Platform Stats from API
  const [pricingStats, setPricingStats] = useState({
    noOfOrg: 250,
    noOfTournaments: 1200,
    noOfPlayers: 35000,
    prizeDistributed: 850000
  });

  // Interactive Revenue Calculator State
  const [entryFee, setEntryFee] = useState(100);
  const [teamsPerMatch, setTeamsPerMatch] = useState(25);
  const [matchesPerWeek, setMatchesPerWeek] = useState(5);

  // Active FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/pricing`);
        const data = await res.json();
        if (data && typeof data === "object") {
          setPricingStats(prev => ({
            ...prev,
            noOfOrg: data.noOfOrg || prev.noOfOrg,
            noOfTournaments: data.noOfTournaments || prev.noOfTournaments,
            noOfPlayers: data.noOfPlayers || prev.noOfPlayers,
            prizeDistributed: data.prizeDistributed || prev.prizeDistributed
          }));
        }
      } catch (err) {
        console.error("Pricing fetch error:", err);
      }
    };
    fetchPricing();
  }, []);

  // Calculator calculations
  const matchCollection = entryFee * teamsPerMatch;
  const weeklyCollection = matchCollection * matchesPerWeek;
  const monthlyCollection = weeklyCollection * 4;
  const hoursSavedPerMonth = matchesPerWeek * 2.5 * 4; // average 2.5 hrs saved per match

  const organizerFaqs = [
    {
      q: "How does the dedicated payment.ubresports.in gateway work for Organizers?",
      a: "As an organizer, you get direct integration with payment.ubresports.in. You simply enter your API Key & API Secret in your organizer profile once. When players register for your matches, our system generates a dynamic UPI QR linked specifically to your gateway account. Entry fees are credited directly to you with automated status confirmation callbacks, completely eliminating fake payment screenshots!"
    },
    {
      q: "Do I need admin approval or have to submit an application to start hosting?",
      a: "No! We have completely eliminated the application review requirement. When you sign up at /organizer/signup, your organizer account is created instantly with approved status. You can configure your gateway and publish your first tournament in under 2 minutes."
    },
    {
      q: "How does 1-Click Automated Room ID & Password dispatch work?",
      a: "Instead of copy-pasting room credentials to 25 different squad captains on WhatsApp, you enter the Room ID and Password once in your Dexor tournament console. Exactly 15 minutes before match time, Dexor encrypts and delivers the credentials to all confirmed participants' dashboards and Telegram bot automatically."
    },
    {
      q: "Can I host free scrims as well as paid prize pool tournaments?",
      a: "Yes! Dexor supports both ₹0 free practice scrims (for community building, clan tryouts, and qualifiers) as well as paid high-stakes tournaments. You have 100% autonomy over your entry fees and prize pools."
    },
    {
      q: "How does the Anti-Cheat POV review console protect my tournament reputation?",
      a: "Dexor includes a built-in POV submission module. Winning teams and top fraggers must submit their screen recordings after the match. You and your moderators can review these clips directly in your organizer dashboard before releasing prize payouts, ensuring 100% fair play."
    },
    {
      q: "Can I view the transaction history of all joined players?",
      a: "Yes! Your organizer profile contains a dedicated Real-Time Transaction Ledger. Every payment includes the player's name, Order ID, UTR number, match name, amount, date, and live payment status."
    }
  ];

  return (
    <div className="org-landing-wrap">
      {/* Background Neon Ambient Glows */}
      <div className="org-glow-top"></div>
      <div className="org-glow-mid"></div>
      <div className="org-glow-bottom"></div>

      {/* =========================================================
          TOP DUAL PORTAL SWITCHER BANNER
          ========================================================= */}
      <div className="org-top-switch-bar">
        <div className="org-top-switch-inner">
          <span style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaGamepad style={{ color: "#00f0ff", fontSize: "16px" }} />
            <strong>Are you a Competitive Player looking to join tournaments?</strong>
            <span style={{ color: "#a0a3b5" }}>Compete in daily scrims & win real cash with 100% Anti-Cheat POV!</span>
          </span>
          <Link to="/player" className="org-switch-btn">
            Explore Players Arena <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* =========================================================
          DEDICATED ORGANIZER HEADER / NAVBAR
          ========================================================= */}
      <nav className="org-navbar">
        <div className="org-navbar-inner">
          <div className="org-nav-brand" onClick={() => navigate("/organizer")}>
            <img
              src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png"
              alt="Dexor Esports Logo"
              className="org-nav-logo"
            />
            <span className="org-nav-brand-badge">ORGANIZER SUITE</span>
          </div>

          <div className="org-nav-links">
            <a href="#why-dexor" className="org-nav-link">Why Dexor?</a>
            <a href="#gateway" className="org-nav-link">Payment Gateway</a>
            <a href="#comparison" className="org-nav-link">Comparison</a>
            <a href="#calculator" className="org-nav-link">Revenue Calculator</a>
            <a href="#roadmap" className="org-nav-link">How it Works</a>
            <a href="#faq" className="org-nav-link">FAQ</a>
          </div>

          <div className="org-nav-actions">
            <Link to="/organizer/login" className="btn-nav-login">
              Organizer Login
            </Link>
            <Link to="/organizer/signup" className="btn-nav-signup">
              <FaRocket /> Launch Your Website
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================================
          1. HERO SECTION (ORGANIZERS FOCUSED)
          ========================================================= */}
      <header className="org-hero-section">
        <div className="org-hero-eyebrow">
          <FaCrown style={{ color: "#ffd700" }} />
          <span>YOUR OWN BRANDED WEBSITE • ZERO APPROVAL WAIT • 100% AUTOMATED</span>
        </div>

        <h1 className="org-hero-title">
          YOUR OWN BRANDED ESPORTS WEBSITE. <br />
          <span className="gradient-text-org">AUTOMATE, HOST & MONETIZE TOURNAMENTS</span>
        </h1>

        <p className="org-hero-desc">
          Get your own dedicated tournament portal at <strong>organizationname.mydomain.com</strong> in 60 seconds! Stop managing chaotic WhatsApp groups, verifying fake payment screenshots, and manually broadcasting room credentials. Dexor gives tournament organizers a complete <strong>automated multi-tenant SaaS platform</strong> with <strong>custom website branding</strong>, <strong>direct UPI payment gateway QR</strong>, and <strong>1-click room credentials dispatch</strong>.
        </p>

        <div className="org-hero-cta-group">
          <Link to="/organizer/signup" className="btn-org-primary">
            <FaRocket /> Launch My Organization Website (Free)
          </Link>
          <Link to="/organizer/login" className="btn-org-secondary">
            <FaCrown /> Login to Organizer Console
          </Link>
        </div>

        {/* Live Ecosystem Stats */}
        <div className="org-stats-grid">
          <div className="org-stat-card">
            <div className="org-stat-val">{pricingStats.noOfOrg}+</div>
            <div className="org-stat-title">Active Tournament Hosts</div>
          </div>
          <div className="org-stat-card">
            <div className="org-stat-val">{pricingStats.noOfTournaments}+</div>
            <div className="org-stat-title">Tournaments Hosted</div>
          </div>
          <div className="org-stat-card">
            <div className="org-stat-val">{pricingStats.noOfPlayers}+</div>
            <div className="org-stat-title">Gamer Network Reach</div>
          </div>
          <div className="org-stat-card">
            <div className="org-stat-val">₹{Number(pricingStats.prizeDistributed).toLocaleString()}+</div>
            <div className="org-stat-title">Prize Money Distributed</div>
          </div>
        </div>
      </header>

      {/* =========================================================
          2. CORE SECTION: WHY CHOOSE DEXOR TO HOST TOURNAMENTS?
          ========================================================= */}
      <section id="why-dexor" className="org-section">
        <div className="org-section-header">
          <div className="org-section-eyebrow">
            <FaRocket /> THE HOST ADVANTAGE
          </div>
          <h2 className="org-section-title">
            WHY ORGANIZERS <span className="gradient-text-org">CHOOSE DEXOR ESPORTS</span>
          </h2>
          <p className="org-section-desc">
            Everything you need to run professional, leak-proof, and profitable esports tournaments without drowning in administrative chaos.
          </p>
        </div>

        <div className="org-features-grid">
          {/* Tool 0: Branded Website */}
          <div className="org-feature-card" style={{ border: "1px solid rgba(0, 240, 255, 0.4)", background: "linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(112, 0, 255, 0.08))" }}>
            <div className="org-feature-icon-badge" style={{ background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", borderColor: "#00f0ff" }}>
              <FaGlobe />
            </div>
            <h3>Your Own Branded Subdomain Website</h3>
            <p>
              Instantly receive your dedicated public portal at <strong>yourname.mydomain.com</strong>. Showcases your logo, banner, custom colors, social channels, and dynamically displays only your tournaments and leaderboards to your players!
            </p>
            <div className="org-feature-highlight" style={{ color: "#00f0ff" }}>
              <FaCheck /> yourname.mydomain.com • 100% Isolated Database Scoping
            </div>
          </div>

          {/* Tool 1 */}
          <div className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(254, 38, 244, 0.15)", color: "#fe26f4", borderColor: "#fe26f4" }}>
              <FaRocket />
            </div>
            <h3>Direct Instant Account Activation</h3>
            <p>
              Zero application forms and no review delays. You don't have to wait for manual admin approval. Sign up in 30 seconds and your tournament hosting dashboard is instantly live and ready.
            </p>
            <div className="org-feature-highlight" style={{ color: "#fe26f4" }}>
              <FaCheck /> Instant Dashboard Access • Zero Bureaucracy
            </div>
          </div>

          {/* Tool 2 */}
          <div id="gateway" className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", borderColor: "#00f0ff" }}>
              <FaQrcode />
            </div>
            <h3>Dedicated payment.ubresports.in Gateway</h3>
            <p>
              Set up your API Key & Secret once in your profile. When players join your tournaments, they scan YOUR custom dynamic UPI QR code. 100% of player entry fees go directly into your gateway account with instant automated payment confirmation callbacks.
            </p>
            <div className="org-feature-highlight" style={{ color: "#00f0ff" }}>
              <FaCheck /> Zero Fake Screenshots • Direct Bank/UPI Settlement
            </div>
          </div>

          {/* Tool 3 */}
          <div className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(255, 183, 3, 0.15)", color: "#ffb703", borderColor: "#ffb703" }}>
              <FaChartLine />
            </div>
            <h3>Real-Time Financial Ledger & UTR Logs</h3>
            <p>
              Access a complete match transaction ledger showing every participant's Order ID, UTR number, payment amount, player name, date, and live status. Export transaction sheets in one click for crystal-clear accounting.
            </p>
            <div className="org-feature-highlight" style={{ color: "#ffb703" }}>
              <FaCheck /> 100% Transparent Financial Tracking
            </div>
          </div>

          {/* Tool 4 */}
          <div className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(46, 196, 182, 0.15)", color: "#2ec4b6", borderColor: "#2ec4b6" }}>
              <FaKey />
            </div>
            <h3>1-Click Automated Room Dispatch</h3>
            <p>
              Stop manually messaging 100+ players on WhatsApp! Enter the Room ID and Password once in your organizer console; Dexor automatically encrypts and delivers it to all confirmed participants' screens and Telegram bot 15 minutes before the match.
            </p>
            <div className="org-feature-highlight" style={{ color: "#2ec4b6" }}>
              <FaCheck /> Zero Leakage • Instant Synchronized Delivery
            </div>
          </div>

          {/* Tool 5 */}
          <div className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(57, 57, 255, 0.15)", color: "#3939ff", borderColor: "#3939ff" }}>
              <FaUsers />
            </div>
            <h3>Automated Team Roster & Slot Management</h3>
            <p>
              No more messy Google Forms or manual spreadsheets. Collect in-game character IDs, BGMI/FF IDs, team rosters, and squad contact info automatically as slots fill up in real time.
            </p>
            <div className="org-feature-highlight" style={{ color: "#3939ff" }}>
              <FaCheck /> Real-Time Live Slot Counter
            </div>
          </div>

          {/* Tool 6 */}
          <div className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(230, 57, 70, 0.15)", color: "#e63946", borderColor: "#e63946" }}>
              <FaShieldAlt />
            </div>
            <h3>Integrated Anti-Cheat POV Review Desk</h3>
            <p>
              Maintain a flawless tournament reputation. Winning teams submit their in-game screen recordings directly to your POV station. Review suspicious plays and resolve disputes transparently before prize payouts.
            </p>
            <div className="org-feature-highlight" style={{ color: "#e63946" }}>
              <FaCheck /> Built-in Fair Play Video Verification
            </div>
          </div>

          {/* Tool 7 */}
          <div className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(114, 9, 183, 0.15)", color: "#7209b7", borderColor: "#7209b7" }}>
              <FaTelegramPlane />
            </div>
            <h3>Telegram Bot & Community Broadcasts</h3>
            <p>
              Leverage Dexor's automated Telegram bot to broadcast your tournament registration links, match alerts, slot fill updates, and final room notifications to thousands of active competitive gamers.
            </p>
            <div className="org-feature-highlight" style={{ color: "#7209b7" }}>
              <FaCheck /> Viral Reach Across Active Esports Communities
            </div>
          </div>

          {/* Tool 8 */}
          <div className="org-feature-card">
            <div className="org-feature-icon-badge" style={{ background: "rgba(0, 180, 216, 0.15)", color: "#00b4d8", borderColor: "#00b4d8" }}>
              <FaCrown />
            </div>
            <h3>100% Host Autonomy & Monetization</h3>
            <p>
              You maintain total control. Set custom entry fees, choose Solo/Duo/Squad formats, define prize pool breakdowns, establish custom tournament rules, and build your own esports clan brand.
            </p>
            <div className="org-feature-highlight" style={{ color: "#00b4d8" }}>
              <FaCheck /> Complete Control of Your Tournaments
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. COMPARISON TABLE: WHATSAPP HOSTING VS DEXOR SUITE
          ========================================================= */}
      <section id="comparison" className="org-section">
        <div className="org-section-header">
          <div className="org-section-eyebrow">
            <FaLayerGroup /> HEAD-TO-HEAD COMPARISON
          </div>
          <h2 className="org-section-title">
            MANUAL HOSTING <span className="gradient-text-org">VS DEXOR HOST SUITE</span>
          </h2>
          <p className="org-section-desc">
            See how much time, money, and headaches you save when switching from manual WhatsApp management to Dexor.
          </p>
        </div>

        <div className="org-table-wrap">
          <table className="org-table">
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Operation / Workflow</th>
                <th style={{ width: "35%", color: "#ff4d4d" }}>❌ Manual WhatsApp & Google Forms</th>
                <th style={{ width: "40%", color: "#00f0ff" }}>⚡ Dexor Automated Host Suite</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Organizer Onboarding</strong></td>
                <td style={{ color: "#ff8585" }}>Days of manual approval, document verification, or no dedicated platform.</td>
                <td style={{ color: "#4ade80" }}><strong>Instant Direct Account Creation (30 seconds).</strong> Zero wait time.</td>
              </tr>
              <tr>
                <td><strong>Payment Collection & QR</strong></td>
                <td style={{ color: "#ff8585" }}>Sharing static UPI QR; players send fake edited screenshots or duplicate UTRs.</td>
                <td style={{ color: "#4ade80" }}><strong>Dedicated payment.ubresports.in Gateway.</strong> Dynamic UPI QR with automated callbacks. Zero fake payments!</td>
              </tr>
              <tr>
                <td><strong>Financial Ledger & Logs</strong></td>
                <td style={{ color: "#ff8585" }}>Manual spreadsheet tracking; high risk of payment disputes and calculation errors.</td>
                <td style={{ color: "#4ade80" }}><strong>Automated Real-Time Transaction Ledger</strong> with Order ID, UTR, and timestamp.</td>
              </tr>
              <tr>
                <td><strong>Room ID & Password Dispatch</strong></td>
                <td style={{ color: "#ff8585" }}>Manually sending to 25 squad IGLs; credentials leak to uninvited players; delayed start.</td>
                <td style={{ color: "#4ade80" }}><strong>1-Click Automated Encrypted Dispatch</strong> to all joined participants' screens & Telegram bot.</td>
              </tr>
              <tr>
                <td><strong>Player Roster Management</strong></td>
                <td style={{ color: "#ff8585" }}>Messy WhatsApp chat lists; missing in-game IDs and duplicate team names.</td>
                <td style={{ color: "#4ade80" }}><strong>Clean Participant Console</strong> with verified in-game names and squad lineups.</td>
              </tr>
              <tr>
                <td><strong>Anti-Cheat Verification</strong></td>
                <td style={{ color: "#ff8585" }}>Players send huge videos on WhatsApp or Google Drive links that expire; chaotic disputes.</td>
                <td style={{ color: "#4ade80" }}><strong>Built-in POV Review Station</strong> for fast video inspection and fair play rulings.</td>
              </tr>
              <tr>
                <td><strong>Time Spent per Tournament</strong></td>
                <td style={{ color: "#ff8585" }}>2 to 3 hours of exhausting administrative copy-pasting and phone messaging.</td>
                <td style={{ color: "#4ade80" }}><strong>Less than 3 minutes total!</strong> Dexor automates everything in the background.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================
          4. INTERACTIVE ORGANIZER REVENUE CALCULATOR
          ========================================================= */}
      <section id="calculator" className="org-section">
        <div className="org-section-header">
          <div className="org-section-eyebrow">
            <FaCalculator /> REVENUE ESTIMATOR
          </div>
          <h2 className="org-section-title">
            ESTIMATE YOUR <span className="gradient-text-org">TOURNAMENT EARNINGS</span>
          </h2>
          <p className="org-section-desc">
            Calculate your potential revenue and see how many hours of administrative work Dexor saves for your team every month.
          </p>
        </div>

        <div className="org-calc-card">
          <div className="org-calc-grid">
            {/* Left Controls */}
            <div>
              <div className="calc-control-group">
                <div className="calc-control-header">
                  <span className="calc-label">Entry Fee per Team (₹):</span>
                  <span className="calc-value-display">₹{entryFee}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div className="calc-control-group">
                <div className="calc-control-header">
                  <span className="calc-label">Teams / Slots per Tournament:</span>
                  <span className="calc-value-display">{teamsPerMatch} Teams</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={teamsPerMatch}
                  onChange={(e) => setTeamsPerMatch(Number(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div className="calc-control-group">
                <div className="calc-control-header">
                  <span className="calc-label">Tournaments Hosted per Week:</span>
                  <span className="calc-value-display">{matchesPerWeek} Matches/Week</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={matchesPerWeek}
                  onChange={(e) => setMatchesPerWeek(Number(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div style={{ marginTop: "20px", padding: "14px", background: "rgba(255, 255, 255, 0.04)", borderRadius: "10px", fontSize: "13px", color: "#a0a3b5" }}>
                💡 <strong>Host Tip:</strong> With payment.ubresports.in integrated, 100% of these entry fees are collected automatically through dynamic UPI QR codes.
              </div>
            </div>

            {/* Right Result Card */}
            <div className="calc-result-box">
              <div className="calc-result-eyebrow">ESTIMATED MONTHLY GROSS COLLECTION</div>
              <div className="calc-result-number">₹{monthlyCollection.toLocaleString()}</div>
              <div className="calc-result-sub">collected directly into your payment gateway</div>

              <div className="calc-breakdown-row">
                <span>Collection per Match:</span>
                <span>₹{matchCollection.toLocaleString()}</span>
              </div>
              <div className="calc-breakdown-row">
                <span>Weekly Entry Collection:</span>
                <span>₹{weeklyCollection.toLocaleString()}</span>
              </div>
              <div className="calc-breakdown-row" style={{ color: "#00f0ff" }}>
                <span>Admin Hours Saved per Month:</span>
                <span style={{ color: "#00f0ff" }}>~{hoursSavedPerMonth} Hours</span>
              </div>

              <button
                className="btn-org-primary"
                onClick={() => navigate("/organizer/signup")}
                style={{ width: "100%", marginTop: "25px", justifyContent: "center" }}
              >
                <FaRocket /> Start Hosting Now (Direct Access)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. HOW TO HOST IN 4 EASY STEPS (ORGANIZER ROADMAP)
          ========================================================= */}
      <section id="roadmap" className="org-section">
        <div className="org-section-header">
          <div className="org-section-eyebrow">
            <FaRocket /> STREAMLINED ONBOARDING
          </div>
          <h2 className="org-section-title">
            HOW TO HOST ON DEXOR <span className="gradient-text-org">IN 4 EASY STEPS</span>
          </h2>
          <p className="org-section-desc">
            From zero to hosting your first automated tournament in under 5 minutes.
          </p>
        </div>

        <div className="org-steps-grid">
          <div className="org-step-card">
            <div className="org-step-num">01</div>
            <div className="org-step-badge" style={{ color: "#fe26f4" }}>STEP 1</div>
            <h3 className="org-step-title">Create Instant Account</h3>
            <p className="org-step-desc">
              Sign up at /organizer/signup. No forms to fill, no wait for approval. Your account is active and verified instantly.
            </p>
          </div>

          <div className="org-step-card">
            <div className="org-step-num">02</div>
            <div className="org-step-badge" style={{ color: "#00f0ff" }}>STEP 2</div>
            <h3 className="org-step-title">Setup Payment Gateway</h3>
            <p className="org-step-desc">
              Go to Profile $\rightarrow$ Gateway Setup. Add your payment.ubresports.in API Key & Secret so player entry fees flow directly to you.
            </p>
          </div>

          <div className="org-step-card">
            <div className="org-step-num">03</div>
            <div className="org-step-badge" style={{ color: "#ffb703" }}>STEP 3</div>
            <h3 className="org-step-title">Publish Tournament</h3>
            <p className="org-step-desc">
              Set match schedule, game mode (BGMI, Free Fire, etc.), map, entry fee, prize pool, and custom rules. Your tournament is published instantly!
            </p>
          </div>

          <div className="org-step-card">
            <div className="org-step-num">04</div>
            <div className="org-step-badge" style={{ color: "#2ec4b6" }}>STEP 4</div>
            <h3 className="org-step-title">1-Click Dispatch & Payout</h3>
            <p className="org-step-desc">
              Slots fill up automatically. When ready, enter Room ID/Password once to dispatch to all players, review POV, and release prizes.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. ORGANIZER TESTIMONIALS & CASE STUDIES
          ========================================================= */}
      <section className="org-section">
        <div className="org-section-header">
          <div className="org-section-eyebrow">
            <FaStar style={{ color: "#ffb703" }} /> COMMUNITY TRUST
          </div>
          <h2 className="org-section-title">
            LOVED BY <span className="gradient-text-org">TOURNAMENT ORGANIZERS</span>
          </h2>
          <p className="org-section-desc">
            Here is what esports clans and event hosts say about running matches on Dexor.
          </p>
        </div>

        <div className="org-features-grid">
          <div className="org-feature-card">
            <div style={{ display: "flex", gap: "4px", color: "#ffb703", marginBottom: "15px" }}>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p style={{ fontStyle: "italic", marginBottom: "20px" }}>
              "Before Dexor, verifying 25 WhatsApp payment screenshots for every single BGMI custom match was a nightmare. We had players sending fake edited receipts. With payment.ubresports.in gateway on Dexor, payments are 100% verified automatically. It saved our clan over 3 hours every single night!"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "linear-gradient(135deg, #fe26f4, #8b00ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                PX
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", color: "#ffffff" }}>Phoenix Esports Clan</h4>
                <small style={{ color: "#fe26f4" }}>Hosted 140+ Tournaments</small>
              </div>
            </div>
          </div>

          <div className="org-feature-card">
            <div style={{ display: "flex", gap: "4px", color: "#ffb703", marginBottom: "15px" }}>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p style={{ fontStyle: "italic", marginBottom: "20px" }}>
              "The 1-click Room ID & Password dispatch is a masterpiece. I just type the credentials once, and all 100 players receive it securely on their screens and Telegram. Zero room leaks and zero delays. Pure perfection!"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "linear-gradient(135deg, #00f0ff, #3939ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                TC
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", color: "#ffffff" }}>Titan Gaming Hub</h4>
                <small style={{ color: "#00f0ff" }}>Collegiate Esports Host</small>
              </div>
            </div>
          </div>

          <div className="org-feature-card">
            <div style={{ display: "flex", gap: "4px", color: "#ffb703", marginBottom: "15px" }}>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p style={{ fontStyle: "italic", marginBottom: "20px" }}>
              "Creating an account took literally 30 seconds with no application or approval waiting. The live transaction ledger gives us a crystal-clear record of every single player payment and UTR number."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "linear-gradient(135deg, #ffb703, #e63946)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                AL
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", color: "#ffffff" }}>Apex League India</h4>
                <small style={{ color: "#ffb703" }}>Free Fire MAX Organizer</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. ORGANIZER FAQS
          ========================================================= */}
      <section id="faq" className="org-section">
        <div className="org-section-header">
          <div className="org-section-eyebrow">
            <FaShieldAlt style={{ color: "#00f0ff" }} /> GOT QUESTIONS?
          </div>
          <h2 className="org-section-title">
            ORGANIZER <span className="gradient-text-org">FREQUENTLY ASKED QUESTIONS</span>
          </h2>
          <p className="org-section-desc">
            Everything you need to know about setting up your gateway, hosting matches, and managing tournaments.
          </p>
        </div>

        <div className="org-faq-container">
          {organizerFaqs.map((faq, idx) => (
            <div
              key={idx}
              className={`org-faq-item ${activeFaq === idx ? "active" : ""}`}
              onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
            >
              <div className="org-faq-question">
                <span>{faq.q}</span>
                <span style={{ fontSize: "18px", color: activeFaq === idx ? "#fe26f4" : "#00f0ff" }}>
                  {activeFaq === idx ? "−" : "+"}
                </span>
              </div>
              {activeFaq === idx && (
                <div className="org-faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          8. FINAL ORGANIZER CALL TO ACTION BANNER
          ========================================================= */}
      <section className="org-section">
        <div className="org-cta-banner">
          <div className="org-hero-eyebrow" style={{ marginBottom: "15px" }}>
            <IoFlash style={{ color: "#fe26f4" }} /> START IN 60 SECONDS
          </div>
          <h2 className="org-cta-title">
            READY TO SCALE YOUR ESPORTS TOURNAMENTS?
          </h2>
          <p className="org-cta-desc">
            Join hundreds of gaming clans, streamers, and organizers who have switched to Dexor's automated tournament operations platform.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            <Link to="/organizer/signup" className="btn-org-primary">
              <FaRocket /> Create Instant Organizer Account
            </Link>
            <Link to="/organizer/login" className="btn-org-secondary">
              <FaCrown /> Login to Organizer Console
            </Link>
          </div>

          <div style={{ marginTop: "35px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <span style={{ color: "#a0a3b5", fontSize: "14px", marginRight: "10px" }}>
              Are you a gamer looking to join tournaments and win cash?
            </span>
            <Link
              to="/"
              style={{
                color: "#00f0ff",
                fontWeight: "bold",
                fontSize: "14px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              Switch to Players Arena <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          ORGANIZER SUITE FOOTER
          ========================================================= */}
      <footer className="org-footer">
        <div className="org-footer-links">
          <Link to="/">Players Arena</Link>
          <Link to="/tournaments">Live Tournaments</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/organizer/signup">Organizer Signup</Link>
          <Link to="/organizer/login">Organizer Login</Link>
          <a href="#why-dexor">Features</a>
          <a href="#gateway">Payment Gateway</a>
          <a href="#calculator">Revenue Estimator</a>
        </div>
        <p>© 2026 Dexor Esports. All rights reserved. Built for competitive gamers and tournament hosts.</p>
      </footer>
    </div>
  );
}