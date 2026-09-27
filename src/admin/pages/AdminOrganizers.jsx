import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../compo/AdminLayout";
import styles from "../css/AdminTables.module.css";
import { useAdminAuth } from "../context/useAdminAuth";
import { 
  MdSearch, 
  MdCheck, 
  MdClose, 
  MdDelete, 
  MdEdit, 
  MdRefresh
} from "react-icons/md";

export default function AdminOrganizers() {
    const { adminToken } = useAdminAuth();
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal state for View/Edit
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchOrganizers = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (statusFilter !== "all") queryParams.append("status", statusFilter);
            if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/organizers?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrganizers(data.organizers || []);
            }
        } catch (err) {
            console.error("Error fetching organizers:", err);
        } finally {
            setLoading(false);
        }
    }, [adminToken, statusFilter, searchQuery]);

    useEffect(() => {
        fetchOrganizers();
    }, [fetchOrganizers]);

    // Handle Quick Status Change (Approve / Reject)
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/organizers/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert(`Organizer status updated to: ${newStatus}`);
                fetchOrganizers();
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    // Handle Delete Organizer
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete organizer "${name}" and all their tournaments?`)) {
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/organizers/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` }
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Organizer deleted successfully");
                fetchOrganizers();
            } else {
                alert(data.message || "Failed to delete organizer");
            }
        } catch {
            alert("Error communicating with server");
        }
    };

    // Handle Edit Save
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/organizers/${selectedOrg._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify(selectedOrg)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Organizer details updated successfully");
                setModalOpen(false);
                fetchOrganizers();
            } else {
                alert(data.message || "Failed to update details");
            }
        } catch {
            alert("Error saving organizer details");
        }
    };

    return (
        <AdminLayout onRefresh={fetchOrganizers}>
            <div className={styles.pageContainer}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderLeft}>
                        <h1>Organizers & <span>KYC Applications</span></h1>
                        <p>Approve tournament host applications, review social credibility, and manage organizer accounts.</p>
                    </div>
                </div>

                {/* Control Bar: Search + Status Filter */}
                <div className={styles.controlsBar}>
                    <div className={styles.searchBox}>
                        <MdSearch style={{ color: "#64748b", fontSize: "18px" }} />
                        <input 
                            type="text" 
                            placeholder="Search by Org Name, Host, Email, Phone..." 
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
                            <option value="all">All Organizers</option>
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approved & Active</option>
                            <option value="rejected">Rejected / Suspended</option>
                        </select>

                        <button className={styles.refreshBtn} onClick={fetchOrganizers}>
                            <MdRefresh /> Refresh
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableResponsive} data-lenis-prevent>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Organization</th>
                                    <th>Host Name</th>
                                    <th>Contact & Social</th>
                                    <th>Region</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {organizers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className={styles.emptyState}>
                                            {loading ? "Loading organizers..." : "No organizers found matching current filter."}
                                        </td>
                                    </tr>
                                ) : (
                                    organizers.map((org) => (
                                        <tr key={org._id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: "#fff" }}>
                                                    {org.organizationName || "Independent Host"}
                                                </div>
                                                <small style={{ color: "#00f0ff" }}>ID: {org._id.slice(-6)}</small>
                                            </td>
                                            <td>
                                                <div style={{ color: "#fff" }}>{org.name}</div>
                                                <small style={{ color: "#64748b" }}>{org.email}</small>
                                            </td>
                                            <td>
                                                <div>{org.phone_number || org.whatsapp_number || "No Phone"}</div>
                                                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                                                    {org.youtube_channel && <small style={{ color: "#ff3366" }}>YouTube</small>}
                                                    {org.discord && <small style={{ color: "#8a2be2" }}>Discord</small>}
                                                    {org.instagram && <small style={{ color: "#00f0ff" }}>Insta</small>}
                                                </div>
                                            </td>
                                            <td>
                                                {org.city || org.state ? `${org.city || ""}, ${org.state || ""}` : "India"}
                                            </td>
                                            <td>
                                                <span className={`
                                                    ${styles.badge}
                                                    ${org.approved_stts === 'approved' ? styles.badgeApproved : 
                                                      org.approved_stts === 'rejected' ? styles.badgeRejected : styles.badgePending}
                                                `}>
                                                    {org.approved_stts || "pending"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionBtnGroup}>
                                                    {org.approved_stts !== 'approved' && (
                                                        <button 
                                                            className={`${styles.actionBtn} ${styles.actionBtnApprove}`}
                                                            onClick={() => handleStatusUpdate(org._id, 'approved')}
                                                            title="Approve Organizer"
                                                        >
                                                            <MdCheck /> Approve
                                                        </button>
                                                    )}
                                                    {org.approved_stts !== 'rejected' && (
                                                        <button 
                                                            className={`${styles.actionBtn} ${styles.actionBtnReject}`}
                                                            onClick={() => handleStatusUpdate(org._id, 'rejected')}
                                                            title="Reject/Suspend Organizer"
                                                        >
                                                            <MdClose /> Reject
                                                        </button>
                                                    )}
                                                    <button 
                                                        className={styles.actionBtn}
                                                        onClick={() => { setSelectedOrg(org); setIsEditing(true); setModalOpen(true); }}
                                                        title="Edit Organizer"
                                                    >
                                                        <MdEdit />
                                                    </button>
                                                    <button 
                                                        className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                                        onClick={() => handleDelete(org._id, org.organizationName || org.name)}
                                                        title="Delete Organizer"
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

                {/* View / Edit Modal Drawer */}
                {modalOpen && selectedOrg && (
                    <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                            <div className={styles.modalHeader}>
                                <h3>{isEditing ? "Edit Organizer Profile" : "Organizer Application Details"}</h3>
                                <button className={styles.modalCloseBtn} onClick={() => setModalOpen(false)}>
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Organization Name</label>
                                            <input 
                                                type="text" 
                                                value={selectedOrg.organizationName || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, organizationName: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Host Full Name</label>
                                            <input 
                                                type="text" 
                                                value={selectedOrg.name || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, name: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Official Email</label>
                                            <input 
                                                type="email" 
                                                value={selectedOrg.email || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, email: e.target.value })}
                                                required 
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Phone Number</label>
                                            <input 
                                                type="text" 
                                                value={selectedOrg.phone_number || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, phone_number: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>WhatsApp Number</label>
                                            <input 
                                                type="text" 
                                                value={selectedOrg.whatsapp_number || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, whatsapp_number: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Status</label>
                                            <select 
                                                value={selectedOrg.approved_stts || "pending"}
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, approved_stts: e.target.value })}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>YouTube Channel</label>
                                            <input 
                                                type="text" 
                                                value={selectedOrg.youtube_channel || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, youtube_channel: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Discord Server</label>
                                            <input 
                                                type="text" 
                                                value={selectedOrg.discord || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, discord: e.target.value })}
                                            />
                                        </div>

                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>About Organizer / Bio</label>
                                            <textarea 
                                                rows="3"
                                                value={selectedOrg.about || ""} 
                                                onChange={(e) => setSelectedOrg({ ...selectedOrg, about: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setModalOpen(false)}>
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
