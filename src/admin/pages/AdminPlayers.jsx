import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../compo/AdminLayout";
import styles from "../css/AdminTables.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdSearch, 
  MdVerified, 
  MdEdit, 
  MdDelete, 
  MdRefresh
} from "react-icons/md";

export default function AdminPlayers() {
    const { adminToken } = useAdminAuth();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modals
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [teamsModalOpen, setTeamsModalOpen] = useState(false);

    const fetchPlayers = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/players?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setPlayers(data.players || []);
            }
        } catch (err) {
            console.error("Error fetching players:", err);
        } finally {
            setLoading(false);
        }
    }, [adminToken, searchQuery]);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    // Toggle Verification Badge
    const handleToggleVerify = async (player) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/players/${player._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify({ verified: !player.verified })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert(`Player ${player.name} is now ${!player.verified ? "VERIFIED ✓" : "UNVERIFIED"}`);
                fetchPlayers();
            } else {
                alert(data.message || "Failed to toggle verification");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    // Save Edit Player
    const handleSavePlayer = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/players/${selectedPlayer._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(selectedPlayer)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Player profile updated successfully");
                setEditModalOpen(false);
                fetchPlayers();
            } else {
                alert(data.message || "Failed to update player");
            }
        } catch {
            alert("Error saving player profile");
        }
    };

    // Delete Player
    const handleDeletePlayer = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete player account "${name}"?`)) {
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/players/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` }
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Player deleted successfully");
                fetchPlayers();
            } else {
                alert(data.message || "Failed to delete player");
            }
        } catch {
            alert("Error deleting player");
        }
    };

    return (
        <AdminLayout onRefresh={fetchPlayers}>
            <div className={styles.pageContainer}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderLeft}>
                        <h1>Players <span>Directory & Roster</span></h1>
                        <p>Manage all registered esports gamers, verify authentic credentials, and inspect team rosters.</p>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className={styles.controlsBar}>
                    <div className={styles.searchBox}>
                        <MdSearch style={{ color: "#64748b", fontSize: "18px" }} />
                        <input 
                            type="text" 
                            placeholder="Search by Player Name, Email, IGN, or UID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <button className={styles.refreshBtn} onClick={fetchPlayers}>
                            <MdRefresh /> Refresh
                        </button>
                    </div>
                </div>

                {/* Players Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableResponsive} data-lenis-prevent>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Player Info</th>
                                    <th>In-Game Name (IGN)</th>
                                    <th>BGMI UID</th>
                                    <th>Record (W/L)</th>
                                    <th>Earnings</th>
                                    <th>Teams Created</th>
                                    <th>Verification</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className={styles.emptyState}>
                                            {loading ? "Loading player database..." : "No players found matching your query."}
                                        </td>
                                    </tr>
                                ) : (
                                    players.map((player) => (
                                        <tr key={player._id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                                                    {player.name}
                                                    {player.verified && <MdVerified style={{ color: "#00f0ff" }} title="Verified Gamer" />}
                                                </div>
                                                <small style={{ color: "#64748b" }}>{player.email}</small>
                                            </td>
                                            <td style={{ color: "#00f0ff", fontWeight: 600 }}>
                                                {player.ign || "Not Set"}
                                            </td>
                                            <td style={{ fontFamily: "monospace" }}>
                                                {player.uid || "N/A"}
                                            </td>
                                            <td>
                                                {player.wins || 0}W / {player.loses || 0}L
                                            </td>
                                            <td style={{ color: "#00ff88", fontWeight: 700 }}>
                                                ₹{player.earned || 0}
                                            </td>
                                            <td>
                                                <button 
                                                    style={{ background: "transparent", border: "none", color: "#8a2be2", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                                                    onClick={() => { setSelectedPlayer(player); setTeamsModalOpen(true); }}
                                                >
                                                    {(player.teams || []).length} Teams
                                                </button>
                                            </td>
                                            <td>
                                                <span 
                                                    className={`${styles.badge} ${player.verified ? styles.badgeApproved : styles.badgeNormal}`}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleToggleVerify(player)}
                                                    title="Click to toggle verification status"
                                                >
                                                    {player.verified ? "Verified ✓" : "Unverified"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionBtnGroup}>
                                                    <button 
                                                        className={styles.actionBtn}
                                                        onClick={() => { setSelectedPlayer(player); setEditModalOpen(true); }}
                                                        title="Edit Player"
                                                    >
                                                        <MdEdit />
                                                    </button>
                                                    <button 
                                                        className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                                        onClick={() => handleDeletePlayer(player._id, player.name)}
                                                        title="Delete Player"
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

                {/* Edit Player Modal */}
                {editModalOpen && selectedPlayer && (
                    <div className={styles.modalOverlay} onClick={() => setEditModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Edit Player Profile</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setEditModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSavePlayer}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Full Name</label>
                                            <input 
                                                type="text" 
                                                value={selectedPlayer.name || ""} 
                                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, name: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Email Address</label>
                                            <input 
                                                type="email" 
                                                value={selectedPlayer.email || ""} 
                                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, email: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>In-Game Name (IGN)</label>
                                            <input 
                                                type="text" 
                                                value={selectedPlayer.ign || ""} 
                                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, ign: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Game UID</label>
                                            <input 
                                                type="text" 
                                                value={selectedPlayer.uid || ""} 
                                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, uid: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Matches Won</label>
                                            <input 
                                                type="text" 
                                                value={selectedPlayer.wins || "0"} 
                                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, wins: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Earned Balance (₹)</label>
                                            <input 
                                                type="text" 
                                                value={selectedPlayer.earned || "0"} 
                                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, earned: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Verified Badge</label>
                                            <select 
                                                value={selectedPlayer.verified ? "true" : "false"}
                                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, verified: e.target.value === "true" })}
                                            >
                                                <option value="true">Verified ✓</option>
                                                <option value="false">Unverified</option>
                                            </select>
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

                {/* View Player Teams Modal */}
                {teamsModalOpen && selectedPlayer && (
                    <div className={styles.modalOverlay} onClick={() => setTeamsModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>{selectedPlayer.name}'s Teams ({(selectedPlayer.teams || []).length})</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setTeamsModalOpen(false)}>&times;</button>
                            </div>
                            <div className={styles.modalBody}>
                                {(!selectedPlayer.teams || selectedPlayer.teams.length === 0) ? (
                                    <div className={styles.emptyState}>Player has not created any teams yet.</div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                        {selectedPlayer.teams.map((t, idx) => (
                                            <div 
                                                key={idx}
                                                style={{ 
                                                    background: "rgba(255, 255, 255, 0.03)", 
                                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                                    padding: "16px",
                                                    borderRadius: "8px"
                                                }}
                                            >
                                                <h4 style={{ margin: "0 0 10px", color: "#00f0ff" }}>
                                                    {t.teamName}
                                                </h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "#cbd5e1" }}>
                                                    <div><strong>IGL:</strong> {t.igl?.name} ({t.igl?.ign})</div>
                                                    <div><strong>Assaulter:</strong> {t.assaulter?.name} ({t.assaulter?.ign})</div>
                                                    <div><strong>Rusher:</strong> {t.rusher?.name} ({t.rusher?.ign})</div>
                                                    <div><strong>Helper:</strong> {t.helper?.name} ({t.helper?.ign})</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={() => setTeamsModalOpen(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
