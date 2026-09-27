import { useState, useEffect } from "react";
import styles from "../css/paymentGateway.module.css";
import { FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash, FaKey, FaSyncAlt, FaSearch, FaReceipt } from "react-icons/fa";

export default function OrganizerPaymentGateway() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    // Form inputs
    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");
    const [merchantName, setMerchantName] = useState("");
    const [showSecret, setShowSecret] = useState(false);
    const [isConfigured, setIsConfigured] = useState(false);

    // Alert feedback
    const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

    // Transactions and Stats
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTransactions: 0,
        successCount: 0,
        pendingCount: 0,
        failedCount: 0
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Fetch initial config and transactions
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("jwt");
            if (!token) return;

            // 1. Fetch Gateway Config
            const configRes = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/payment-gateway`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (configRes.ok) {
                const configData = await configRes.json();
                setIsConfigured(configData.isConfigured);
                setMerchantName(configData.merchantName || "");
                if (configData.rawApiKey) {
                    setApiKey(configData.rawApiKey);
                } else if (configData.apiKey) {
                    setApiKey(configData.apiKey);
                }
                if (configData.hasSecret) {
                    setApiSecret("••••••••••••••••");
                }
            }

            // 2. Fetch Transactions
            await fetchTransactions();

            setLoading(false);
        } catch (err) {
            console.error("fetchData error:", err);
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) return;

            const txRes = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/payment-gateway/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (txRes.ok) {
                const txData = await txRes.json();
                setTransactions(txData.transactions || []);
                if (txData.stats) {
                    setStats(txData.stats);
                }
            }
        } catch (err) {
            console.error("fetchTransactions error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Save Gateway Configuration
    const handleSave = async (e) => {
        e.preventDefault();
        setAlert(null);

        if (!apiKey.trim() || !apiSecret.trim()) {
            setAlert({ type: "error", message: "Both API Key and API Secret are required." });
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("jwt");
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/payment-gateway`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    apiKey: apiKey.trim(),
                    apiSecret: apiSecret.trim(),
                    merchantName: merchantName.trim()
                })
            });

            const data = await res.json();
            if (res.ok) {
                setIsConfigured(true);
                setAlert({ 
                    type: "success", 
                    message: data.message || "Payment Gateway (payment.ubresports.in) configured successfully!" 
                });
                if (data.rawApiKey) setApiKey(data.rawApiKey);
            } else {
                setAlert({ 
                    type: "error", 
                    message: data.error || "Failed to save payment gateway credentials." 
                });
            }
            setSaving(false);
        } catch (err) {
            console.error("handleSave error:", err);
            setAlert({ type: "error", message: "Server connection failed while saving configuration." });
            setSaving(false);
        }
    };

    // Test Gateway Connection
    const handleTest = async () => {
        setAlert(null);
        try {
            setTesting(true);
            const token = localStorage.getItem("jwt");
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/payment-gateway/test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    apiKey: apiKey.trim(),
                    apiSecret: apiSecret.trim()
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setAlert({ type: "success", message: data.message });
            } else {
                setAlert({ type: "error", message: data.message || data.error || "Connection test failed." });
            }
            setTesting(false);
        } catch (err) {
            console.error("handleTest error:", err);
            setAlert({ type: "error", message: "Connection test error. Please check network." });
            setTesting(false);
        }
    };

    // Filtered Transactions
    const filteredTransactions = transactions.filter((tx) => {
        const matchesStatus = 
            statusFilter === "ALL" ? true : (tx.status || "").toUpperCase() === statusFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
            !q || 
            (tx.orderId && tx.orderId.toLowerCase().includes(q)) ||
            (tx.tournamentName && tx.tournamentName.toLowerCase().includes(q)) ||
            (tx.playerName && tx.playerName.toLowerCase().includes(q)) ||
            (tx.teamName && tx.teamName.toLowerCase().includes(q)) ||
            (tx.utr && tx.utr.toLowerCase().includes(q));

        return matchesStatus && matchesSearch;
    });

    const formatDate = (d) => {
        if (!d) return "-";
        const date = new Date(d);
        if (isNaN(date.getTime())) return d;
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className={styles.gatewaySection}>
            {/* 1. Payment Gateway Configuration Box */}
            <div className={styles.configCard}>
                <div className={styles.cardHeader}>
                    <div>
                        <div className={styles.providerBadge}>
                            <FaKey /> Official Gateway: payment.ubresports.in
                        </div>
                        <h2 className={styles.cardTitle}>Tournament Payment Gateway Setup</h2>
                        <p className={styles.cardDesc}>
                            Connect your <strong>payment.ubresports.in</strong> account. When players join your tournaments or matches, 
                            the platform displays your dedicated dynamic UPI QR code. Entry fees go directly into your organizer account.
                        </p>
                    </div>

                    <div className={`${styles.statusPill} ${isConfigured ? styles.statusActive : styles.statusInactive}`}>
                        <span className={styles.dot}></span>
                        {isConfigured ? "Gateway Connected" : "Not Configured"}
                    </div>
                </div>

                <form onSubmit={handleSave}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Merchant / Business Name</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="e.g. HunterX Esports"
                                    value={merchantName}
                                    onChange={(e) => setMerchantName(e.target.value)}
                                />
                            </div>
                            <span className={styles.fieldHint}>Displayed to players on UPI QR checkout modal</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label>API Key (X-API-Key)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="pi_live_..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    required
                                />
                            </div>
                            <span className={styles.fieldHint}>Provided by payment.ubresports.in</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label>API Secret (X-API-Secret)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showSecret ? "text" : "password"}
                                    placeholder="sk_live_..."
                                    value={apiSecret}
                                    onChange={(e) => setApiSecret(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => setShowSecret(!showSecret)}
                                    title={showSecret ? "Hide Secret" : "Show Secret"}
                                >
                                    {showSecret ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <span className={styles.fieldHint}>Kept strictly encrypted and safe</span>
                        </div>
                    </div>

                    <div className={styles.btnActions}>
                        <button type="submit" className={styles.btnSave} disabled={saving || loading}>
                            {saving ? "Saving Gateway..." : "Save Credentials"}
                        </button>

                        <button 
                            type="button" 
                            className={styles.btnTest} 
                            onClick={handleTest} 
                            disabled={testing || saving || (!apiKey && !apiSecret)}
                        >
                            {testing ? "Testing Ping..." : "Test Connection"}
                        </button>
                    </div>

                    {alert && (
                        <div className={`${styles.alertBox} ${alert.type === "success" ? styles.alertSuccess : styles.alertError}`}>
                            {alert.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                            <span>{alert.message}</span>
                        </div>
                    )}
                </form>
            </div>

            {/* 2. Match Join Transactions History */}
            <div className={styles.transactionsCard}>
                <div className={styles.cardHeader}>
                    <div>
                        <div className={styles.providerBadge}>
                            <FaReceipt /> Match Payment History
                        </div>
                        <h2 className={styles.cardTitle}>Tournament Entry Transactions</h2>
                        <p className={styles.cardDesc}>
                            Live record of all players who paid entry fees through your payment.ubresports.in gateway to join your matches.
                        </p>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className={styles.statsBar}>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Total Collected</div>
                        <div className={`${styles.statValue} ${styles.statValueGreen}`}>
                            ₹{stats.totalRevenue.toLocaleString("en-IN")}
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Successful Entries</div>
                        <div className={`${styles.statValue} ${styles.statValueCyan}`}>
                            {stats.successCount}
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Pending Orders</div>
                        <div className={`${styles.statValue} ${styles.statValueYellow}`}>
                            {stats.pendingCount}
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Total Transactions</div>
                        <div className={styles.statValue}>
                            {stats.totalTransactions}
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className={styles.tableToolbar}>
                    <div className={styles.searchBox}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Tournament, Player, or Team..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterTabs}>
                        {["ALL", "SUCCESS", "PENDING", "FAILED"].map((status) => (
                            <button
                                key={status}
                                type="button"
                                className={`${styles.tabBtn} ${statusFilter === status ? styles.tabActive : ""}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <button 
                        type="button" 
                        className={styles.btnRefresh} 
                        onClick={fetchTransactions} 
                        title="Refresh Transaction Logs"
                    >
                        <FaSyncAlt /> Refresh
                    </button>
                </div>

                {/* Transactions Table */}
                <div className={styles.tableWrapper}>
                    {filteredTransactions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <i className="fa-solid fa-receipt"></i>
                            <h4>No Transactions Found</h4>
                            <p>
                                {transactions.length === 0
                                    ? "When players pay entry fees to join your tournaments, their transactions will appear here."
                                    : "No transactions match your current search/filter."}
                            </p>
                        </div>
                    ) : (
                        <table className={styles.txnTable}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Tournament</th>
                                    <th>Player / Team</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>UTR / Ref</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx._id || tx.orderId}>
                                        <td className={styles.orderIdText}>{tx.orderId}</td>
                                        <td className={styles.tourNameText}>{tx.tournamentName || "Tournament"}</td>
                                        <td className={styles.playerText}>
                                            <span>{tx.teamName || tx.playerName || "Player"}</span>
                                            <small>{tx.playerName ? `Player: ${tx.playerName}` : ""}</small>
                                        </td>
                                        <td className={styles.amountText}>
                                            ₹{(tx.amount || 0).toLocaleString("en-IN")}
                                        </td>
                                        <td>{formatDate(tx.createdAt)}</td>
                                        <td>
                                            <span
                                                className={`${styles.badge} ${
                                                    tx.status === "SUCCESS"
                                                        ? styles.badgeSuccess
                                                        : tx.status === "FAILED"
                                                        ? styles.badgeFailed
                                                        : styles.badgePending
                                                }`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className={styles.orderIdText}>
                                            {tx.utr || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
