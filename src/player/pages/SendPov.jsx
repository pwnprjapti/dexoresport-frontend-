import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Nav from '../compo/nav.jsx'
import Footer from '../compo/Footer.jsx'
import '../css/sendPov.css'

// React Icons
import { 
  FaCloudUploadAlt, 
  FaInfoCircle, 
  FaTrashAlt, 
  FaLink, 
  FaGamepad
} from 'react-icons/fa'
import { IoCheckmarkDoneCircle } from 'react-icons/io5'

export default function SendPov() {
  const { tourId, teamId } = useParams()
  const navigate = useNavigate()

  // State for 5 players upload details
  const [povData, setPovData] = useState({
    p1: { name: 'Mortal', ign: 'SOUL_Mortal_IGL', uid: '512398412', role: 'In-Game Leader (IGL)', videoFile: null, videoUrl: '', note: '', previewSrc: '' },
    p2: { name: 'Goblin', ign: 'SOUL_Goblin_Fragger', uid: '588391024', role: 'Entry Assaulter', videoFile: null, videoUrl: '', note: '', previewSrc: '' },
    p3: { name: 'Hector', ign: 'SOUL_Hector_Rush', uid: '574892103', role: 'Flanker / Rusher', videoFile: null, videoUrl: '', note: '', previewSrc: '' },
    p4: { name: 'Akshat', ign: 'SOUL_Akshat_Supp', uid: '593810294', role: 'Support / Utility', videoFile: null, videoUrl: '', note: '', previewSrc: '' },
    p5: { name: 'Omega', ign: 'SOUL_Omega_Sub', uid: '529481938', role: 'Substitute / Sniper', videoFile: null, videoUrl: '', note: '', previewSrc: '' },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Handle Video File Selection for a specific player
  const handleFileChange = (playerKey, e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPovData(prev => ({
        ...prev,
        [playerKey]: {
          ...prev[playerKey],
          videoFile: file,
          previewSrc: previewUrl
        }
      }))
    }
  }

  // Remove Selected Video for a specific player
  const handleRemoveVideo = (playerKey) => {
    setPovData(prev => ({
      ...prev,
      [playerKey]: {
        ...prev[playerKey],
        videoFile: null,
        previewSrc: ''
      }
    }))
  }

  // Handle Text Input Changes
  const handleInputChange = (playerKey, field, value) => {
    setPovData(prev => ({
      ...prev,
      [playerKey]: {
        ...prev[playerKey],
        [field]: value
      }
    }))
  }

  // Count how many players have a video or cloud link ready
  const uploadedCount = Object.values(povData).filter(p => p.videoFile || p.videoUrl.trim()).length

  // Handle Form Submission
  const handleSubmitAll = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API upload
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      alert("✅ All 5 Players POV Videos have been submitted successfully to the Tournament Referee Committee!")
    }, 1500)
  }

  return (
    <>
      <Nav />

      <div className="sendpov-container">
        {/* Header */}
        <div className="sendpov-header">
          <div className="sendpov-title-area">
            <h1>Submit Player <span>POV Videos</span></h1>
            <span className="badge-upload-count">{uploadedCount} / 5 Ready</span>
          </div>

          <div>
            <button className="notif-btn-secondary" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>

        {/* Guidelines Card */}
        <div className="guidelines-card">
          <FaInfoCircle className="guidelines-icon" />
          <div className="guidelines-content">
            <h4>Mandatory POV Submission Guidelines</h4>
            <ul>
              <li>Upload full match recording from spawn island till your squad elimination / victory.</li>
              <li>Internal game sound and microphone communication must be clearly audible.</li>
              <li>Supported file formats: <strong>MP4, MOV, MKV</strong> (Max 500MB each) or paste an <strong>Unlisted YouTube / Google Drive Link</strong>.</li>
              <li>Must be submitted within <strong>60 minutes</strong> of match completion to avoid penalty or disqualification.</li>
            </ul>
          </div>
        </div>

        {/* Match / Tournament Context Strip */}
        <div className="match-info-strip">
          <div className="strip-item">
            <FaGamepad color="#00f0ff" />
            <span>Tournament ID:</span> <strong>{tourId || "DX-TOUR-892"}</strong>
          </div>
          <div className="strip-item">
            <span>Team:</span> <strong>Team Soul Alpha ({teamId || "TM-SOUL-104"})</strong>
          </div>
          <div className="strip-item">
            <span>Match:</span> <strong>Erangel (Grand Finals Match #3)</strong>
          </div>
          <div className="strip-item">
            <span>Slot:</span> <strong>Slot #14</strong>
          </div>
        </div>

        {/* Form Container */}
        {submitSuccess && (
          <div style={{ background: 'rgba(0,255,100,0.15)', border: '1px solid #00ff66', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#00ff66', textAlign: 'center', fontWeight: 'bold' }}>
            ✅ POV videos have been submitted successfully to the Tournament Referee Committee!
          </div>
        )}
        <form onSubmit={handleSubmitAll}>
          {/* 5 Players Grid */}
          <div className="player-pov-grid">

            {/* ===================== PLAYER 1 (IGL) ===================== */}
            <div className={`player-upload-card ${(povData.p1.videoFile || povData.p1.videoUrl) ? 'uploaded-ready' : ''}`}>
              <div className="card-top">
                <div className="card-player-info">
                  <span className="slot-tag">P1</span>
                  <div className="player-names-box">
                    <h3>{povData.p1.ign}</h3>
                    <span>{povData.p1.role}</span>
                  </div>
                </div>
                <span className={`upload-status-pill ${(povData.p1.videoFile || povData.p1.videoUrl) ? 'pill-ready' : 'pill-pending'}`}>
                  {(povData.p1.videoFile || povData.p1.videoUrl) ? 'Video Attached' : 'Pending'}
                </span>
              </div>

              <div className="card-form-body">
                <div className="input-row">
                  <div className="form-field">
                    <label>Player Name</label>
                    <input 
                      type="text" 
                      value={povData.p1.name} 
                      onChange={(e) => handleInputChange('p1', 'name', e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label>BGMI UID</label>
                    <input 
                      type="text" 
                      value={povData.p1.uid} 
                      onChange={(e) => handleInputChange('p1', 'uid', e.target.value)} 
                    />
                  </div>
                </div>

                {/* Video Upload Dropzone or Video Preview */}
                {!povData.p1.previewSrc ? (
                  <div className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="video/mp4,video/x-m4v,video/*" 
                      onChange={(e) => handleFileChange('p1', e)} 
                    />
                    <FaCloudUploadAlt className="dropzone-icon" />
                    <span className="dropzone-text">Click or Drag Video File Here</span>
                    <span className="dropzone-hint">MP4, MOV, MKV up to 500MB</span>
                  </div>
                ) : (
                  <div className="video-preview-wrapper">
                    <video src={povData.p1.previewSrc} controls className="video-preview-element" />
                    <div className="preview-file-info">
                      <span>{povData.p1.videoFile?.name || "Player 1 POV Video"}</span>
                      <button type="button" className="btn-remove-video" onClick={() => handleRemoveVideo('p1')}>
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Cloud Link Input (Alternative) */}
                <div className="form-field">
                  <label><FaLink /> Or Paste Drive / YouTube Link</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/... or YouTube Unlisted" 
                    value={povData.p1.videoUrl} 
                    onChange={(e) => handleInputChange('p1', 'videoUrl', e.target.value)} 
                  />
                </div>

                {/* Notes */}
                <div className="form-field">
                  <label>Referee Notes / Fight Timestamps</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pochinki fight timestamp 12:30, handcam included" 
                    value={povData.p1.note} 
                    onChange={(e) => handleInputChange('p1', 'note', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* ===================== PLAYER 2 (Assaulter) ===================== */}
            <div className={`player-upload-card ${(povData.p2.videoFile || povData.p2.videoUrl) ? 'uploaded-ready' : ''}`}>
              <div className="card-top">
                <div className="card-player-info">
                  <span className="slot-tag">P2</span>
                  <div className="player-names-box">
                    <h3>{povData.p2.ign}</h3>
                    <span>{povData.p2.role}</span>
                  </div>
                </div>
                <span className={`upload-status-pill ${(povData.p2.videoFile || povData.p2.videoUrl) ? 'pill-ready' : 'pill-pending'}`}>
                  {(povData.p2.videoFile || povData.p2.videoUrl) ? 'Video Attached' : 'Pending'}
                </span>
              </div>

              <div className="card-form-body">
                <div className="input-row">
                  <div className="form-field">
                    <label>Player Name</label>
                    <input 
                      type="text" 
                      value={povData.p2.name} 
                      onChange={(e) => handleInputChange('p2', 'name', e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label>BGMI UID</label>
                    <input 
                      type="text" 
                      value={povData.p2.uid} 
                      onChange={(e) => handleInputChange('p2', 'uid', e.target.value)} 
                    />
                  </div>
                </div>

                {!povData.p2.previewSrc ? (
                  <div className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="video/mp4,video/x-m4v,video/*" 
                      onChange={(e) => handleFileChange('p2', e)} 
                    />
                    <FaCloudUploadAlt className="dropzone-icon" />
                    <span className="dropzone-text">Click or Drag Video File Here</span>
                    <span className="dropzone-hint">MP4, MOV, MKV up to 500MB</span>
                  </div>
                ) : (
                  <div className="video-preview-wrapper">
                    <video src={povData.p2.previewSrc} controls className="video-preview-element" />
                    <div className="preview-file-info">
                      <span>{povData.p2.videoFile?.name || "Player 2 POV Video"}</span>
                      <button type="button" className="btn-remove-video" onClick={() => handleRemoveVideo('p2')}>
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label><FaLink /> Or Paste Drive / YouTube Link</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/... or YouTube Unlisted" 
                    value={povData.p2.videoUrl} 
                    onChange={(e) => handleInputChange('p2', 'videoUrl', e.target.value)} 
                  />
                </div>

                <div className="form-field">
                  <label>Referee Notes / Fight Timestamps</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 6 Kills fragging recorded in 1080p 60fps" 
                    value={povData.p2.note} 
                    onChange={(e) => handleInputChange('p2', 'note', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* ===================== PLAYER 3 (Rusher) ===================== */}
            <div className={`player-upload-card ${(povData.p3.videoFile || povData.p3.videoUrl) ? 'uploaded-ready' : ''}`}>
              <div className="card-top">
                <div className="card-player-info">
                  <span className="slot-tag">P3</span>
                  <div className="player-names-box">
                    <h3>{povData.p3.ign}</h3>
                    <span>{povData.p3.role}</span>
                  </div>
                </div>
                <span className={`upload-status-pill ${(povData.p3.videoFile || povData.p3.videoUrl) ? 'pill-ready' : 'pill-pending'}`}>
                  {(povData.p3.videoFile || povData.p3.videoUrl) ? 'Video Attached' : 'Pending'}
                </span>
              </div>

              <div className="card-form-body">
                <div className="input-row">
                  <div className="form-field">
                    <label>Player Name</label>
                    <input 
                      type="text" 
                      value={povData.p3.name} 
                      onChange={(e) => handleInputChange('p3', 'name', e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label>BGMI UID</label>
                    <input 
                      type="text" 
                      value={povData.p3.uid} 
                      onChange={(e) => handleInputChange('p3', 'uid', e.target.value)} 
                    />
                  </div>
                </div>

                {!povData.p3.previewSrc ? (
                  <div className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="video/mp4,video/x-m4v,video/*" 
                      onChange={(e) => handleFileChange('p3', e)} 
                    />
                    <FaCloudUploadAlt className="dropzone-icon" />
                    <span className="dropzone-text">Click or Drag Video File Here</span>
                    <span className="dropzone-hint">MP4, MOV, MKV up to 500MB</span>
                  </div>
                ) : (
                  <div className="video-preview-wrapper">
                    <video src={povData.p3.previewSrc} controls className="video-preview-element" />
                    <div className="preview-file-info">
                      <span>{povData.p3.videoFile?.name || "Player 3 POV Video"}</span>
                      <button type="button" className="btn-remove-video" onClick={() => handleRemoveVideo('p3')}>
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label><FaLink /> Or Paste Drive / YouTube Link</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/... or YouTube Unlisted" 
                    value={povData.p3.videoUrl} 
                    onChange={(e) => handleInputChange('p3', 'videoUrl', e.target.value)} 
                  />
                </div>

                <div className="form-field">
                  <label>Referee Notes / Fight Timestamps</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Smoke tracking defense POV at 18:40" 
                    value={povData.p3.note} 
                    onChange={(e) => handleInputChange('p3', 'note', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* ===================== PLAYER 4 (Support) ===================== */}
            <div className={`player-upload-card ${(povData.p4.videoFile || povData.p4.videoUrl) ? 'uploaded-ready' : ''}`}>
              <div className="card-top">
                <div className="card-player-info">
                  <span className="slot-tag">P4</span>
                  <div className="player-names-box">
                    <h3>{povData.p4.ign}</h3>
                    <span>{povData.p4.role}</span>
                  </div>
                </div>
                <span className={`upload-status-pill ${(povData.p4.videoFile || povData.p4.videoUrl) ? 'pill-ready' : 'pill-pending'}`}>
                  {(povData.p4.videoFile || povData.p4.videoUrl) ? 'Video Attached' : 'Pending'}
                </span>
              </div>

              <div className="card-form-body">
                <div className="input-row">
                  <div className="form-field">
                    <label>Player Name</label>
                    <input 
                      type="text" 
                      value={povData.p4.name} 
                      onChange={(e) => handleInputChange('p4', 'name', e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label>BGMI UID</label>
                    <input 
                      type="text" 
                      value={povData.p4.uid} 
                      onChange={(e) => handleInputChange('p4', 'uid', e.target.value)} 
                    />
                  </div>
                </div>

                {!povData.p4.previewSrc ? (
                  <div className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="video/mp4,video/x-m4v,video/*" 
                      onChange={(e) => handleFileChange('p4', e)} 
                    />
                    <FaCloudUploadAlt className="dropzone-icon" />
                    <span className="dropzone-text">Click or Drag Video File Here</span>
                    <span className="dropzone-hint">MP4, MOV, MKV up to 500MB</span>
                  </div>
                ) : (
                  <div className="video-preview-wrapper">
                    <video src={povData.p4.previewSrc} controls className="video-preview-element" />
                    <div className="preview-file-info">
                      <span>{povData.p4.videoFile?.name || "Player 4 POV Video"}</span>
                      <button type="button" className="btn-remove-video" onClick={() => handleRemoveVideo('p4')}>
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label><FaLink /> Or Paste Drive / YouTube Link</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/... or YouTube Unlisted" 
                    value={povData.p4.videoUrl} 
                    onChange={(e) => handleInputChange('p4', 'videoUrl', e.target.value)} 
                  />
                </div>

                <div className="form-field">
                  <label>Referee Notes / Fight Timestamps</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Utility grenades & smoke deployment view" 
                    value={povData.p4.note} 
                    onChange={(e) => handleInputChange('p4', 'note', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* ===================== PLAYER 5 (Substitute / Sniper) ===================== */}
            <div className={`player-upload-card ${(povData.p5.videoFile || povData.p5.videoUrl) ? 'uploaded-ready' : ''}`}>
              <div className="card-top">
                <div className="card-player-info">
                  <span className="slot-tag">P5</span>
                  <div className="player-names-box">
                    <h3>{povData.p5.ign}</h3>
                    <span>{povData.p5.role}</span>
                  </div>
                </div>
                <span className={`upload-status-pill ${(povData.p5.videoFile || povData.p5.videoUrl) ? 'pill-ready' : 'pill-pending'}`}>
                  {(povData.p5.videoFile || povData.p5.videoUrl) ? 'Video Attached' : 'Pending'}
                </span>
              </div>

              <div className="card-form-body">
                <div className="input-row">
                  <div className="form-field">
                    <label>Player Name</label>
                    <input 
                      type="text" 
                      value={povData.p5.name} 
                      onChange={(e) => handleInputChange('p5', 'name', e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label>BGMI UID</label>
                    <input 
                      type="text" 
                      value={povData.p5.uid} 
                      onChange={(e) => handleInputChange('p5', 'uid', e.target.value)} 
                    />
                  </div>
                </div>

                {!povData.p5.previewSrc ? (
                  <div className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="video/mp4,video/x-m4v,video/*" 
                      onChange={(e) => handleFileChange('p5', e)} 
                    />
                    <FaCloudUploadAlt className="dropzone-icon" />
                    <span className="dropzone-text">Click or Drag Video File Here</span>
                    <span className="dropzone-hint">MP4, MOV, MKV up to 500MB</span>
                  </div>
                ) : (
                  <div className="video-preview-wrapper">
                    <video src={povData.p5.previewSrc} controls className="video-preview-element" />
                    <div className="preview-file-info">
                      <span>{povData.p5.videoFile?.name || "Player 5 POV Video"}</span>
                      <button type="button" className="btn-remove-video" onClick={() => handleRemoveVideo('p5')}>
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label><FaLink /> Or Paste Drive / YouTube Link</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/... or YouTube Unlisted" 
                    value={povData.p5.videoUrl} 
                    onChange={(e) => handleInputChange('p5', 'videoUrl', e.target.value)} 
                  />
                </div>

                <div className="form-field">
                  <label>Referee Notes / Fight Timestamps</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Backup substitute player POV" 
                    value={povData.p5.note} 
                    onChange={(e) => handleInputChange('p5', 'note', e.target.value)} 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="sendpov-bottom-actions">
            <div className="summary-text">
              Status: <strong>{uploadedCount} out of 5</strong> Player POVs ready for submission
            </div>

            <button type="submit" className="btn-submit-all" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Submitting POVs...</>
              ) : (
                <>
                  <IoCheckmarkDoneCircle size={20} /> Submit 5 Players POV to Referee
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  )
}
