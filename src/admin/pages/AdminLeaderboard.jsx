import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../compo/AdminLayout";
import styles from "../css/AdminTables.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdRefresh
} from "react-icons/md";

export default function AdminLeaderboard() {
    const { adminToken } = useAdminAuth();
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    // New Entry Form
    const [newEntry, setNewEntry] = useState({
        player_name: "",
        rank: 1,
        points: 100,
        wins: 5,
        kills: 25,
        kd: "4.50",
        dp: "https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780488368/c8d7aXD4SvWCL8_CMb5ZDQ_tmvj49.webp"
    });

    const fetchLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/leaderboard`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setRankings(data.rankings || []);
            }
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        } finally {
            setLoading(false);
        }
    }, [adminToken]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    // Handle Create Leaderboard Entry
    const handleCreateEntry = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/leaderboard`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(newEntry)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Player added to leaderboard!");
                setAddModalOpen(false);
                fetchLeaderboard();
            } else {
                alert(data.message || "Failed to add entry");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    // Handle Update Leaderboard Entry
    const handleUpdateEntry = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/leaderboard/${selectedEntry._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(selectedEntry)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Leaderboard entry updated!");
                setEditModalOpen(false);
                fetchLeaderboard();
            } else {
                alert(data.message || "Failed to update entry");
            }
        } catch {
            alert("Error updating leaderboard entry");
        }
    };

    // Handle Delete Entry
    const handleDeleteEntry = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove ${name} from the master leaderboard?`)) {
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/leaderboard/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` }
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Entry removed from leaderboard");
                fetchLeaderboard();
            } else {
                alert(data.message || "Failed to delete entry");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    return (
        <AdminLayout onRefresh={fetchLeaderboard}>
            <div className={styles.pageContainer}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderLeft}>
                        <h1>Master <span>Leaderboard Rankings</span></h1>
                        <p>Manage official player rankings, assign tournament points, kills, and crown champions.</p>
                    </div>

                    <button className={styles.headerActionBtn} onClick={() => setAddModalOpen(true)}>
                        <MdAdd style={{ fontSize: "18px" }} /> Add Player Rank
                    </button>
                </div>

                {/* Control Bar */}
                <div className={styles.controlsBar}>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                        Showing <strong>{rankings.length}</strong> top ranked contenders
                    </div>
                    <button className={styles.refreshBtn} onClick={fetchLeaderboard}>
                        <MdRefresh /> Refresh
                    </button>
                </div>

                {/* Leaderboard Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableResponsive} data-lenis-prevent>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player Contender</th>
                                    <th>Points</th>
                                    <th>Matches Won</th>
                                    <th>Total Kills</th>
                                    <th>K/D Ratio</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className={styles.emptyState}>
                                            {loading ? "Loading master leaderboard..." : "No players on leaderboard. Click 'Add Player Rank' to add."}
                                        </td>
                                    </tr>
                                ) : (
                                    rankings.map((entry, idx) => (
                                        <tr key={entry._id}>
                                            <td>
                                                <div style={{ 
                                                    fontWeight: 700, 
                                                    fontFamily: "Orbitron, sans-serif",
                                                    color: idx === 0 ? "#ffd700" : idx === 1 ? "#c0c0c0" : idx === 2 ? "#cd7f32" : "#00f0ff"
                                                }}>
                                                    #{entry.rank || idx + 1}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <img 
                                                        src={entry.dp || "https://res.cloudinary.com/dnfhwfbmq/image/upload/v1780488368/c8d7aXD4SvWCL8_CMb5ZDQ_tmvj49.webp"} 
                                                        alt="Player Avatar" 
                                                        style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #00f0ff" }}
                                                    />
                                                    <span style={{ fontWeight: 600, color: "#fff" }}>{entry.player_name}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: "#00ff88", fontWeight: 700, fontSize: "14px" }}>
                                                {entry.points} pts
                                            </td>
                                            <td>{entry.wins || 0}</td>
                                            <td>{entry.kills || 0}</td>
                                            <td style={{ color: "#ffaa00", fontWeight: 600 }}>{entry.kd || "0.00"}</td>
                                            <td>
                                                <div className={styles.actionBtnGroup}>
                                                    <button 
                                                        className={styles.actionBtn}
                                                        onClick={() => { setSelectedEntry(entry); setEditModalOpen(true); }}
                                                        title="Edit Rank / Stats"
                                                    >
                                                        <MdEdit />
                                                    </button>
                                                    <button 
                                                        className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                                        onClick={() => handleDeleteEntry(entry._id, entry.player_name)}
                                                        title="Remove from Leaderboard"
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL 1: Add New Entry */}
                {addModalOpen && (
                    <div className={styles.modalOverlay} onClick={() => setAddModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Add Player to Master Leaderboard</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setAddModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleCreateEntry}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Player Name / IGN</label>
                                            <input 
                                                type="text" 
                                                value={newEntry.player_name}
                                                onChange={(e) => setNewEntry({ ...newEntry, player_name: e.target.value })}
                                                placeholder="e.g. Soul Mortal"
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Leaderboard Rank (#)</label>
                                            <input 
                                                type="number" 
                                                value={newEntry.rank}
                                                onChange={(e) => setNewEntry({ ...newEntry, rank: Number(e.target.value) })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Championship Points</label>
                                            <input 
                                                type="number" 
                                                value={newEntry.points}
                                                onChange={(e) => setNewEntry({ ...newEntry, points: Number(e.target.value) })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Matches Won</label>
                                            <input 
                                                type="number" 
                                                value={newEntry.wins}
                                                onChange={(e) => setNewEntry({ ...newEntry, wins: Number(e.target.value) })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Total Kills</label>
                                            <input 
                                                type="number" 
                                                value={newEntry.kills}
                                                onChange={(e) => setNewEntry({ ...newEntry, kills: Number(e.target.value) })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>K/D Ratio</label>
                                            <input 
                                                type="text" 
                                                value={newEntry.kd}
                                                onChange={(e) => setNewEntry({ ...newEntry, kd: e.target.value })}
                                                placeholder="e.g. 5.25"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Avatar Image URL</label>
                                            <input 
                                                type="text" 
                                                value={newEntry.dp}
                                                onChange={(e) => setNewEntry({ ...newEntry, dp: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setAddModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.btnSubmit}>
                                        Add Contender
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 2: Edit Entry */}
                {editModalOpen && selectedEntry && (
                    <div className={styles.modalOverlay} onClick={() => setEditModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Edit Leaderboard Entry</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setEditModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleUpdateEntry}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Player Name / IGN</label>
                                            <input 
                                                type="text" 
                                                value={selectedEntry.player_name || ""}
                                                onChange={(e) => setSelectedEntry({ ...selectedEntry, player_name: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Rank Position (#)</label>
                                            <input 
                                                type="number" 
                                                value={selectedEntry.rank || 1}
                                                onChange={(e) => setSelectedEntry({ ...selectedEntry, rank: Number(e.target.value) })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Championship Points</label>
                                            <input 
                                                type="number" 
                                                value={selectedEntry.points || 0}
                                                onChange={(e) => setSelectedEntry({ ...selectedEntry, points: Number(e.target.value) })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Matches Won</label>
                                            <input 
                                                type="number" 
                                                value={selectedEntry.wins || 0}
                                                onChange={(e) => setSelectedEntry({ ...selectedEntry, wins: Number(e.target.value) })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Total Kills</label>
                                            <input 
                                                type="number" 
                                                value={selectedEntry.kills || 0}
                                                onChange={(e) => setSelectedEntry({ ...selectedEntry, kills: Number(e.target.value) })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>K/D Ratio</label>
                                            <input 
                                                type="text" 
                                                value={selectedEntry.kd || "0.00"}
                                                onChange={(e) => setSelectedEntry({ ...selectedEntry, kd: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setEditModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.btnSubmit}>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
