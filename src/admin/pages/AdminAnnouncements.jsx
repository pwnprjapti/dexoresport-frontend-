import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../compo/AdminLayout";
import styles from "../css/AdminTables.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdAdd, 
  MdDelete, 
  MdRefresh, 
  MdNotificationsActive
} from "react-icons/md";

export default function AdminAnnouncements() {
    const { adminToken } = useAdminAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [form, setForm] = useState({
        title: "",
        content: "",
        target: "all",
        category: "update",
        priority: "normal"
    });

    const fetchAnnouncements = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/announcements`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setAnnouncements(data.announcements || []);
            }
        } catch (err) {
            console.error("Error fetching announcements:", err);
        } finally {
            setLoading(false);
        }
    }, [adminToken]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/announcements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Announcement broadcasted successfully!");
                setCreateModalOpen(false);
                setForm({ title: "", content: "", target: "all", category: "update", priority: "normal" });
                fetchAnnouncements();
            } else {
                alert(data.message || "Failed to broadcast");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this announcement?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/announcements/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert("Announcement removed");
                fetchAnnouncements();
            } else {
                alert(data.message || "Failed to delete");
            }
        } catch {
            alert("Error deleting announcement");
        }
    };

    return (
        <AdminLayout onRefresh={fetchAnnouncements}>
            <div className={styles.pageContainer}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderLeft}>
                        <h1>System <span>Announcements & Alerts</span></h1>
                        <p>Broadcast platform notices, tournament alerts, and maintenance updates to players and organizers.</p>
                    </div>

                    <button className={styles.headerActionBtn} onClick={() => setCreateModalOpen(true)}>
                        <MdAdd style={{ fontSize: "18px" }} /> New Broadcast
                    </button>
                </div>

                {/* Control Bar */}
                <div className={styles.controlsBar}>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                        Active platform announcements: <strong>{announcements.length}</strong>
                    </div>
                    <button className={styles.refreshBtn} onClick={fetchAnnouncements}>
                        <MdRefresh /> Refresh
                    </button>
                </div>

                {/* Announcements Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableResponsive} data-lenis-prevent>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Announcement</th>
                                    <th>Target Audience</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Published Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className={styles.emptyState}>
                                            {loading ? "Loading announcements..." : "No announcements published yet. Click 'New Broadcast' to create one."}
                                        </td>
                                    </tr>
                                ) : (
                                    announcements.map((a) => (
                                        <tr key={a._id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <MdNotificationsActive style={{ color: "#ffaa00" }} />
                                                    {a.title}
                                                </div>
                                                <small style={{ color: "#94a3b8", display: "block", marginTop: "4px", maxWidth: "400px", whiteSpace: "normal" }}>
                                                    {a.content}
                                                </small>
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${styles.badgeNormal}`}>
                                                    {a.target.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${styles.badgeLive}`}>
                                                    {a.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`
                                                    ${styles.badge} 
                                                    ${a.priority === 'urgent' ? styles.badgeDanger : 
                                                      a.priority === 'high' ? styles.badgeWarning : styles.badgeApproved}
                                                `}>
                                                    {a.priority}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(a.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button 
                                                    className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                                    onClick={() => handleDelete(a._id)}
                                                    title="Delete Announcement"
                                                >
                                                    <MdDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Modal */}
                {createModalOpen && (
                    <div className={styles.modalOverlay} onClick={() => setCreateModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>Broadcast New Announcement</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setCreateModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Announcement Title</label>
                                            <input 
                                                type="text" 
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                placeholder="e.g. Scheduled Platform Server Maintenance"
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Target Audience</label>
                                            <select 
                                                value={form.target}
                                                onChange={(e) => setForm({ ...form, target: e.target.value })}
                                            >
                                                <option value="all">All Platform Users</option>
                                                <option value="players">Players Only</option>
                                                <option value="organizers">Organizers Only</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Category</label>
                                            <select 
                                                value={form.category}
                                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            >
                                                <option value="update">Platform Update</option>
                                                <option value="tournament">Tournament News</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="alert">Security Alert</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Priority</label>
                                            <select 
                                                value={form.priority}
                                                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>

                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Message Content</label>
                                            <textarea 
                                                rows="4"
                                                value={form.content}
                                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                                placeholder="Write announcement details here..."
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
                                        Publish Broadcast
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
