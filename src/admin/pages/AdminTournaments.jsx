import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../compo/AdminLayout";
import styles from "../css/AdminTables.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdSearch, 
  MdAdd, 
  MdVpnKey, 
  MdEdit, 
  MdDelete, 
  MdRefresh
} from "react-icons/md";

export default function AdminTournaments() {
    const { adminToken } = useAdminAuth();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Modals state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [roomModalOpen, setRoomModalOpen] = useState(false);
    const [entriesModalOpen, setEntriesModalOpen] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);

    // Form state for creating new official tournament
    const [newTourData, setNewTourData] = useState({
        tournament_name: "",
        organization: "Dexor Esports Official",
        game1: "BGMI",
        game2: "Battle Royale",
        prizepool: "5000",
        first: "2500",
        second: "1500",
        third: "1000",
        fourth: "0",
        entryfee: 0,
        ttl_slots: "25",
        map: "Erangel",
        team_format: "SQUAD (4 Players)",
        mode: "TPP",
        stts: "upcoming",
        tour_start_date: new Date().toISOString().split("T")[0],
        tour_start_time: "19:00",
        disc: "Official Dexor Esports Major Tournament. Compete for glory and verified prizes."
    });

    // Room ID state
    const [roomForm, setRoomForm] = useState({ roomId: "", roomPassword: "" });

    const fetchTournaments = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (statusFilter !== "all") queryParams.append("status", statusFilter);
            if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/tournaments?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setTournaments(data.tournaments || []);
            }
        } catch (err) {
            console.error("Error fetching tournaments:", err);
        } finally {
            setLoading(false);
        }
    }, [adminToken, statusFilter, searchQuery]);

    useEffect(() => {
        fetchTournaments();
    }, [fetchTournaments]);

    // Handle Create Official Tournament
    const handleCreateTournament = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/tournaments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(newTourData)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Official tournament launched successfully!");
                setCreateModalOpen(false);
                fetchTournaments();
            } else {
                alert(data.message || "Failed to create tournament");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    // Handle Edit Tournament
    const handleEditTournament = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/tournaments/${selectedTour._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(selectedTour)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Tournament updated successfully!");
                setEditModalOpen(false);
                fetchTournaments();
            } else {
                alert(data.message || "Failed to update tournament");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    // Handle Update Room Credentials
    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/tournaments/${selectedTour._id}/room`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(roomForm)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Custom Room credentials set & match set to LIVE!");
                setRoomModalOpen(false);
                fetchTournaments();
            } else {
                alert(data.message || "Failed to update room details");
            }
        } catch {
            alert("Error saving room details");
        }
    };

    // Handle Delete Tournament
    const handleDeleteTournament = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete tournament "${name}"?`)) {
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/tournaments/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` }
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Tournament deleted successfully");
                fetchTournaments();
            } else {
                alert(data.message || "Failed to delete tournament");
            }
        } catch {
            alert("Error deleting tournament");
        }
    };

    return (
        <AdminLayout onRefresh={fetchTournaments}>
            <div className={styles.pageContainer}>
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderLeft}>
                        <h1>Tournaments <span>Master Controller</span></h1>
                        <p>Manage all esports tournaments, push Room ID/Password, and create official platform championships.</p>
                    </div>

                    <button className={styles.headerActionBtn} onClick={() => setCreateModalOpen(true)}>
                        <MdAdd style={{ fontSize: "18px" }} /> Launch Official Tournament
                    </button>
                </div>

                {/* Controls Bar */}
                <div className={styles.controlsBar}>
                    <div className={styles.searchBox}>
                        <MdSearch style={{ color: "#64748b", fontSize: "18px" }} />
                        <input 
                            type="text" 
                            placeholder="Search by Tournament Name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <select 
                            className={styles.filterSelect}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="live">Live Matches</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Completed</option>
                        </select>

                        <button className={styles.refreshBtn} onClick={fetchTournaments}>
                            <MdRefresh /> Refresh
                        </button>
                    </div>
                </div>

                {/* Tournaments Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableResponsive} data-lenis-prevent>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Tournament Details</th>
                                    <th>Organizer</th>
                                    <th>Prize Pool</th>
                                    <th>Slots Filled</th>
                                    <th>Room Access</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tournaments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className={styles.emptyState}>
                                            {loading ? "Loading tournaments..." : "No tournaments found matching criteria."}
                                        </td>
                                    </tr>
                                ) : (
                                    tournaments.map((tour) => (
                                        <tr key={tour._id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: "#fff" }}>
                                                    {tour.tournament_name || "Unnamed Tournament"}
                                                </div>
                                                <small style={{ color: "#00f0ff" }}>
                                                    {tour.game1 || "BGMI"} • {tour.map || "Erangel"} • {tour.team_format || "Squad"}
                                                </small>
                                            </td>
                                            <td>
                                                <div>{tour.organization || "Dexor Official"}</div>
                                                <small style={{ color: "#64748b" }}>Host ID: {tour.organizer_id?.slice(-6) || "N/A"}</small>
                                            </td>
                                            <td style={{ color: "#00ff88", fontWeight: 700 }}>
                                                ₹{tour.prizepool || 0}
                                                <div style={{ color: "#64748b", fontSize: "11px", fontWeight: 400 }}>
                                                    Fee: ₹{tour.entryfee || 0}
                                                </div>
                                            </td>
                                            <td>
                                                <button 
                                                    style={{ background: "transparent", border: "none", color: "#00f0ff", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                                                    onClick={() => { setSelectedTour(tour); setEntriesModalOpen(true); }}
                                                >
                                                    {(tour.enteries || []).length}/{tour.ttl_slots || 0} Teams
                                                </button>
                                            </td>
                                            <td>
                                                {tour.roomId ? (
                                                    <div>
                                                        <div style={{ color: "#00ff88", fontWeight: 600, fontSize: "12px" }}>
                                                            ID: {tour.roomId}
                                                        </div>
                                                        <small style={{ color: "#cbd5e1" }}>Pass: {tour.roomPassword}</small>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "#64748b", fontSize: "12px" }}>Not Set</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`
                                                    ${styles.badge}
                                                    ${tour.stts === 'live' ? styles.badgeLive : 
                                                      tour.stts === 'past' ? styles.badgeNormal : styles.badgeApproved}
                                                `}>
                                                    {tour.stts || "upcoming"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionBtnGroup}>
                                                    <button 
                                                        className={styles.actionBtn}
                                                        onClick={() => {
                                                            setSelectedTour(tour);
                                                            setRoomForm({ roomId: tour.roomId || "", roomPassword: tour.roomPassword || "" });
                                                            setRoomModalOpen(true);
                                                        }}
                                                        title="Set Room ID & Password"
                                                    >
                                                        <MdVpnKey /> Room
                                                    </button>
                                                    <button 
                                                        className={styles.actionBtn}
                                                        onClick={() => { setSelectedTour(tour); setEditModalOpen(true); }}
                                                        title="Edit Tournament"
                                                    >
                                                        <MdEdit />
                                                    </button>
                                                    <button 
                                                        className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                                        onClick={() => handleDeleteTournament(tour._id, tour.tournament_name)}
                                                        title="Delete Tournament"
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

                {/* MODAL 1: Create Official Tournament */}
                {createModalOpen && (
                    <div className={styles.modalOverlay} onClick={() => setCreateModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Launch Official Tournament</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setCreateModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleCreateTournament}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Tournament Title</label>
                                            <input 
                                                type="text" 
                                                value={newTourData.tournament_name}
                                                onChange={(e) => setNewTourData({ ...newTourData, tournament_name: e.target.value })}
                                                placeholder="e.g. Dexor BGMI Major Series Season 1" 
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Organization / Host</label>
                                            <input 
                                                type="text" 
                                                value={newTourData.organization}
                                                onChange={(e) => setNewTourData({ ...newTourData, organization: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Total Prize Pool (₹)</label>
                                            <input 
                                                type="text" 
                                                value={newTourData.prizepool}
                                                onChange={(e) => setNewTourData({ ...newTourData, prizepool: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>1st Prize (₹)</label>
                                            <input 
                                                type="text" 
                                                value={newTourData.first}
                                                onChange={(e) => setNewTourData({ ...newTourData, first: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>2nd Prize (₹)</label>
                                            <input 
                                                type="text" 
                                                value={newTourData.second}
                                                onChange={(e) => setNewTourData({ ...newTourData, second: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Entry Fee (₹ / Free = 0)</label>
                                            <input 
                                                type="number" 
                                                value={newTourData.entryfee}
                                                onChange={(e) => setNewTourData({ ...newTourData, entryfee: Number(e.target.value) })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Max Slots / Teams</label>
                                            <input 
                                                type="text" 
                                                value={newTourData.ttl_slots}
                                                onChange={(e) => setNewTourData({ ...newTourData, ttl_slots: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Map</label>
                                            <input 
                                                type="text" 
                                                value={newTourData.map}
                                                onChange={(e) => setNewTourData({ ...newTourData, map: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Team Format</label>
                                            <select 
                                                value={newTourData.team_format}
                                                onChange={(e) => setNewTourData({ ...newTourData, team_format: e.target.value })}
                                            >
                                                <option value="SQUAD (4 Players)">SQUAD (4 Players)</option>
                                                <option value="DUO (2 Players)">DUO (2 Players)</option>
                                                <option value="SOLO (1 Player)">SOLO (1 Player)</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Start Date</label>
                                            <input 
                                                type="date" 
                                                value={newTourData.tour_start_date}
                                                onChange={(e) => setNewTourData({ ...newTourData, tour_start_date: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Start Time</label>
                                            <input 
                                                type="time" 
                                                value={newTourData.tour_start_time}
                                                onChange={(e) => setNewTourData({ ...newTourData, tour_start_time: e.target.value })}
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setCreateModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.btnSubmit}>
                                        Launch Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 2: Room ID & Password Push */}
                {roomModalOpen && selectedTour && (
                    <div className={styles.modalOverlay} onClick={() => setRoomModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px" }} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Push Room Credentials</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setRoomModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleUpdateRoom}>
                                <div className={styles.modalBody}>
                                    <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                                        Setting credentials for: <strong style={{ color: "#00f0ff" }}>{selectedTour.tournament_name}</strong>.
                                        This will immediately publish Room details and set the match to <strong>LIVE</strong>.
                                    </p>
                                    <div className={styles.formGroup}>
                                        <label>Custom Room ID</label>
                                        <input 
                                            type="text" 
                                            value={roomForm.roomId} 
                                            onChange={(e) => setRoomForm({ ...roomForm, roomId: e.target.value })}
                                            placeholder="e.g. 549102"
                                            required 
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Custom Room Password</label>
                                        <input 
                                            type="text" 
                                            value={roomForm.roomPassword} 
                                            onChange={(e) => setRoomForm({ ...roomForm, roomPassword: e.target.value })}
                                            placeholder="e.g. dexor123"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setRoomModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.btnSubmit}>
                                        Push & Go Live
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 3: Edit Tournament */}
                {editModalOpen && selectedTour && (
                    <div className={styles.modalOverlay} onClick={() => setEditModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Edit Tournament Details</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setEditModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleEditTournament}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Tournament Title</label>
                                            <input 
                                                type="text" 
                                                value={selectedTour.tournament_name || ""}
                                                onChange={(e) => setSelectedTour({ ...selectedTour, tournament_name: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Status</label>
                                            <select 
                                                value={selectedTour.stts || "upcoming"}
                                                onChange={(e) => setSelectedTour({ ...selectedTour, stts: e.target.value })}
                                            >
                                                <option value="upcoming">Upcoming</option>
                                                <option value="live">Live</option>
                                                <option value="past">Completed (Past)</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Prize Pool (₹)</label>
                                            <input 
                                                type="text" 
                                                value={selectedTour.prizepool || ""}
                                                onChange={(e) => setSelectedTour({ ...selectedTour, prizepool: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Slots Available</label>
                                            <input 
                                                type="text" 
                                                value={selectedTour.ttl_slots || ""}
                                                onChange={(e) => setSelectedTour({ ...selectedTour, ttl_slots: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Map</label>
                                            <input 
                                                type="text" 
                                                value={selectedTour.map || ""}
                                                onChange={(e) => setSelectedTour({ ...selectedTour, map: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setEditModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.btnSubmit}>
                                        Update Tournament
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 4: View Entries / Teams */}
                {entriesModalOpen && selectedTour && (
                    <div className={styles.modalOverlay} onClick={() => setEntriesModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Registered Teams ({selectedTour.enteries?.length || 0})</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setEntriesModalOpen(false)}>&times;</button>
                            </div>
                            <div className={styles.modalBody}>
                                {(!selectedTour.enteries || selectedTour.enteries.length === 0) ? (
                                    <div className={styles.emptyState}>No teams have registered for this tournament yet.</div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {selectedTour.enteries.map((team, idx) => (
                                            <div 
                                                key={idx} 
                                                style={{ 
                                                    background: "rgba(255, 255, 255, 0.03)", 
                                                    border: "1px solid rgba(255, 255, 255, 0.07)",
                                                    padding: "14px", 
                                                    borderRadius: "8px" 
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <h4 style={{ margin: 0, color: "#fff", fontSize: "14px" }}>
                                                        #{idx + 1} {team.teamName || "Unnamed Team"}
                                                    </h4>
                                                    <span style={{ color: "#00f0ff", fontSize: "12px" }}>
                                                        IGL: {team.igl?.name || "N/A"} ({team.igl?.ign || "No IGN"})
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "12px", color: "#94a3b8" }}>
                                                    <span>UID: {team.igl?.uid || "N/A"}</span>
                                                    <span>Players: 4 Squad</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={() => setEntriesModalOpen(false)}>
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
