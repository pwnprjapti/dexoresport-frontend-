import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ControlPanel from "../compo/controlPanel"
import styles from "../css/pov.module.css"

// React Icons
import { 
  FaVideo, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaDownload, 
  FaArrowLeft, 
  FaGamepad, 
  FaEye
} from "react-icons/fa"

export default function Pov() {
  const { tourId, teamId } = useParams()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("all")
  
  // Status state for each player's POV
  const [playerStatus, setPlayerStatus] = useState({
    p1: "Approved",
    p2: "Pending",
    p3: "Flagged",
    p4: "Approved",
    p5: "Approved"
  })

  const updateStatus = (playerKey, newStatus) => {
    setPlayerStatus(prev => ({
      ...prev,
      [playerKey]: newStatus
    }))
  }

  // Sample tournament & team info
  const tournamentTitle = "Dexor BGMI Grand Championship 2026"
  const teamName = "Team Soul Alpha"
  const slotNumber = "14"
  const matchMap = "Erangel (Match #3 Finals)"

  return (
    <>
      <ControlPanel />

      <div className={styles.povContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h1><FaVideo /> Player POV Review Room</h1>
            <p>
              <span>Tournament:</span> <strong>{tournamentTitle}</strong>
              <span>Tournament ID:</span> <strong className={styles.badgeTag}>{tourId || "DX-TOUR-892"}</strong>
              <span>Team ID:</span> <strong className={styles.badgeTagPurple}>{teamId || "TM-SOUL-104"}</strong>
              <span>Match:</span> <strong>{matchMap}</strong>
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.btnBack} onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back to Participants
            </button>
          </div>
        </div>

        {/* Team Details Banner */}
        <div className={styles.teamBanner}>
          <div className={styles.teamMeta}>
            <div className={styles.teamLogo}>
              <FaGamepad color="#00f0ff" />
            </div>
            <div className={styles.teamName}>
              <h2>{teamName}</h2>
              <span>Slot #{slotNumber} • 5 Players Submitted Video Logs</span>
            </div>
          </div>

          <div className={styles.matchStats}>
            <div className={styles.statItem}>
              <span>Total Finishes</span>
              <strong>14 Kills</strong>
            </div>
            <div className={styles.statItem}>
              <span>Match Placement</span>
              <strong>#1 (Winner)</strong>
            </div>
            <div className={styles.statItem}>
              <span>Verification</span>
              <strong style={{ color: '#4ade80' }}>4/5 Approved</strong>
            </div>
          </div>
        </div>

        {/* Player Selection Tabs */}
        <div className={styles.playerTabs}>
          <button 
            className={`${styles.playerTab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FaEye /> All 5 Players View
          </button>
          <button 
            className={`${styles.playerTab} ${activeTab === 'p1' ? styles.active : ''}`}
            onClick={() => setActiveTab('p1')}
          >
            Player 1 (IGL)
          </button>
          <button 
            className={`${styles.playerTab} ${activeTab === 'p2' ? styles.active : ''}`}
            onClick={() => setActiveTab('p2')}
          >
            Player 2 (Assaulter)
          </button>
          <button 
            className={`${styles.playerTab} ${activeTab === 'p3' ? styles.active : ''}`}
            onClick={() => setActiveTab('p3')}
          >
            Player 3 (Rusher)
          </button>
          <button 
            className={`${styles.playerTab} ${activeTab === 'p4' ? styles.active : ''}`}
            onClick={() => setActiveTab('p4')}
          >
            Player 4 (Support)
          </button>
          <button 
            className={`${styles.playerTab} ${activeTab === 'p5' ? styles.active : ''}`}
            onClick={() => setActiveTab('p5')}
          >
            Player 5 (Sub / Sniper)
          </button>
        </div>

        {/* 5 Player POV Cards Grid */}
        <div className={styles.povGrid}>

          {/* ===================== PLAYER 1 ===================== */}
          {(activeTab === 'all' || activeTab === 'p1') && (
            <div className={styles.povCard}>
              <div className={styles.cardHeader}>
                <div className={styles.playerInfo}>
                  <span className={styles.playerNumber}>P1</span>
                  <div>
                    <span className={styles.playerIGN}>SOUL_Mortal_IGL</span>
                    <span className={styles.playerRole}>In-Game Leader (IGL)</span>
                  </div>
                </div>
                <span className={`${styles.statusPill} ${
                  playerStatus.p1 === 'Approved' ? styles.statusApproved : 
                  playerStatus.p1 === 'Flagged' ? styles.statusFlagged : styles.statusPending
                }`}>
                  {playerStatus.p1}
                </span>
              </div>

              <div className={styles.videoWrapper}>
                <video 
                  controls 
                  preload="metadata"
                  className={styles.videoElement}
                  poster="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                <div className={styles.videoOverlayBadge}>1080p • 60 FPS</div>
                <div className={styles.videoDuration}>28:14</div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.playerMetaRow}>
                  <div className={styles.metaCol}>
                    <span>BGMI UID</span>
                    <strong>512398412</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Finishes</span>
                    <strong>4 Kills</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Damage</span>
                    <strong>680 HP</strong>
                  </div>
                </div>
                <div className={styles.notesArea}>
                  <span>Referee Note:</span> Audio clear, handcam & screen match perfectly. No third-party overlay detected.
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button 
                  className={styles.btnActionGreen}
                  onClick={() => updateStatus('p1', 'Approved')}
                >
                  <FaCheckCircle /> Approve
                </button>
                <button 
                  className={styles.btnActionRed}
                  onClick={() => updateStatus('p1', 'Flagged')}
                >
                  <FaExclamationTriangle /> Flag
                </button>
                <a 
                  href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
                  download 
                  className={styles.btnActionDownload}
                  target="_blank" 
                  rel="noreferrer"
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          )}

          {/* ===================== PLAYER 2 ===================== */}
          {(activeTab === 'all' || activeTab === 'p2') && (
            <div className={styles.povCard}>
              <div className={styles.cardHeader}>
                <div className={styles.playerInfo}>
                  <span className={styles.playerNumber}>P2</span>
                  <div>
                    <span className={styles.playerIGN}>SOUL_Goblin_Fragger</span>
                    <span className={styles.playerRole}>Entry Assaulter</span>
                  </div>
                </div>
                <span className={`${styles.statusPill} ${
                  playerStatus.p2 === 'Approved' ? styles.statusApproved : 
                  playerStatus.p2 === 'Flagged' ? styles.statusFlagged : styles.statusPending
                }`}>
                  {playerStatus.p2}
                </span>
              </div>

              <div className={styles.videoWrapper}>
                <video 
                  controls 
                  preload="metadata"
                  className={styles.videoElement}
                  poster="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                <div className={styles.videoOverlayBadge}>1080p • 60 FPS</div>
                <div className={styles.videoDuration}>27:45</div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.playerMetaRow}>
                  <div className={styles.metaCol}>
                    <span>BGMI UID</span>
                    <strong>588391024</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Finishes</span>
                    <strong>6 Kills</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Damage</span>
                    <strong>1,120 HP</strong>
                  </div>
                </div>
                <div className={styles.notesArea}>
                  <span>Referee Note:</span> High headshot percentage in Pochinki fight; review crosshair placement timestamp 14:20.
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button 
                  className={styles.btnActionGreen}
                  onClick={() => updateStatus('p2', 'Approved')}
                >
                  <FaCheckCircle /> Approve
                </button>
                <button 
                  className={styles.btnActionRed}
                  onClick={() => updateStatus('p2', 'Flagged')}
                >
                  <FaExclamationTriangle /> Flag
                </button>
                <a 
                  href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" 
                  download 
                  className={styles.btnActionDownload}
                  target="_blank" 
                  rel="noreferrer"
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          )}

          {/* ===================== PLAYER 3 ===================== */}
          {(activeTab === 'all' || activeTab === 'p3') && (
            <div className={styles.povCard}>
              <div className={styles.cardHeader}>
                <div className={styles.playerInfo}>
                  <span className={styles.playerNumber}>P3</span>
                  <div>
                    <span className={styles.playerIGN}>SOUL_Hector_Rush</span>
                    <span className={styles.playerRole}>Flanker / Rusher</span>
                  </div>
                </div>
                <span className={`${styles.statusPill} ${
                  playerStatus.p3 === 'Approved' ? styles.statusApproved : 
                  playerStatus.p3 === 'Flagged' ? styles.statusFlagged : styles.statusPending
                }`}>
                  {playerStatus.p3}
                </span>
              </div>

              <div className={styles.videoWrapper}>
                <video 
                  controls 
                  preload="metadata"
                  className={styles.videoElement}
                  poster="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                <div className={styles.videoOverlayBadge}>720p • 60 FPS</div>
                <div className={styles.videoDuration}>29:02</div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.playerMetaRow}>
                  <div className={styles.metaCol}>
                    <span>BGMI UID</span>
                    <strong>574892103</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Finishes</span>
                    <strong>3 Kills</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Damage</span>
                    <strong>540 HP</strong>
                  </div>
                </div>
                <div className={styles.notesArea}>
                  <span>Referee Note:</span> Team opponent raised ticket regarding smoke tracking. Timestamp flagged for referee committee.
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button 
                  className={styles.btnActionGreen}
                  onClick={() => updateStatus('p3', 'Approved')}
                >
                  <FaCheckCircle /> Approve
                </button>
                <button 
                  className={styles.btnActionRed}
                  onClick={() => updateStatus('p3', 'Flagged')}
                >
                  <FaExclamationTriangle /> Flag
                </button>
                <a 
                  href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" 
                  download 
                  className={styles.btnActionDownload}
                  target="_blank" 
                  rel="noreferrer"
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          )}

          {/* ===================== PLAYER 4 ===================== */}
          {(activeTab === 'all' || activeTab === 'p4') && (
            <div className={styles.povCard}>
              <div className={styles.cardHeader}>
                <div className={styles.playerInfo}>
                  <span className={styles.playerNumber}>P4</span>
                  <div>
                    <span className={styles.playerIGN}>SOUL_Akshat_Supp</span>
                    <span className={styles.playerRole}>Support / Utility</span>
                  </div>
                </div>
                <span className={`${styles.statusPill} ${
                  playerStatus.p4 === 'Approved' ? styles.statusApproved : 
                  playerStatus.p4 === 'Flagged' ? styles.statusFlagged : styles.statusPending
                }`}>
                  {playerStatus.p4}
                </span>
              </div>

              <div className={styles.videoWrapper}>
                <video 
                  controls 
                  preload="metadata"
                  className={styles.videoElement}
                  poster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                <div className={styles.videoOverlayBadge}>1080p • 60 FPS</div>
                <div className={styles.videoDuration}>28:50</div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.playerMetaRow}>
                  <div className={styles.metaCol}>
                    <span>BGMI UID</span>
                    <strong>593810294</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Finishes</span>
                    <strong>1 Kill</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Damage</span>
                    <strong>320 HP</strong>
                  </div>
                </div>
                <div className={styles.notesArea}>
                  <span>Referee Note:</span> Complete device status shown, clean game client version. Verified.
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button 
                  className={styles.btnActionGreen}
                  onClick={() => updateStatus('p4', 'Approved')}
                >
                  <FaCheckCircle /> Approve
                </button>
                <button 
                  className={styles.btnActionRed}
                  onClick={() => updateStatus('p4', 'Flagged')}
                >
                  <FaExclamationTriangle /> Flag
                </button>
                <a 
                  href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4" 
                  download 
                  className={styles.btnActionDownload}
                  target="_blank" 
                  rel="noreferrer"
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          )}

          {/* ===================== PLAYER 5 ===================== */}
          {(activeTab === 'all' || activeTab === 'p5') && (
            <div className={styles.povCard}>
              <div className={styles.cardHeader}>
                <div className={styles.playerInfo}>
                  <span className={styles.playerNumber}>P5</span>
                  <div>
                    <span className={styles.playerIGN}>SOUL_Omega_Sub</span>
                    <span className={styles.playerRole}>Substitute / DMR Sniper</span>
                  </div>
                </div>
                <span className={`${styles.statusPill} ${
                  playerStatus.p5 === 'Approved' ? styles.statusApproved : 
                  playerStatus.p5 === 'Flagged' ? styles.statusFlagged : styles.statusPending
                }`}>
                  {playerStatus.p5}
                </span>
              </div>

              <div className={styles.videoWrapper}>
                <video 
                  controls 
                  preload="metadata"
                  className={styles.videoElement}
                  poster="https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&auto=format&fit=crop&q=60"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                <div className={styles.videoOverlayBadge}>1080p • 60 FPS</div>
                <div className={styles.videoDuration}>26:10</div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.playerMetaRow}>
                  <div className={styles.metaCol}>
                    <span>BGMI UID</span>
                    <strong>529481938</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Finishes</span>
                    <strong>0 Kills</strong>
                  </div>
                  <div className={styles.metaCol}>
                    <span>Damage</span>
                    <strong>150 HP</strong>
                  </div>
                </div>
                <div className={styles.notesArea}>
                  <span>Referee Note:</span> Substitute player POV submitted as backup. Verification complete.
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button 
                  className={styles.btnActionGreen}
                  onClick={() => updateStatus('p5', 'Approved')}
                >
                  <FaCheckCircle /> Approve
                </button>
                <button 
                  className={styles.btnActionRed}
                  onClick={() => updateStatus('p5', 'Flagged')}
                >
                  <FaExclamationTriangle /> Flag
                </button>
                <a 
                  href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" 
                  download 
                  className={styles.btnActionDownload}
                  target="_blank" 
                  rel="noreferrer"
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
