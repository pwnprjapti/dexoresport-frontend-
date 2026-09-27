import { useState, useEffect } from "react"
import ControlPanel from "../compo/controlPanel"
import styles from "../css/wallet.module.css"
import Loading from "../compo/Loading"

export default function Wallet() {
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const [withdrawAmount, setWithdrawAmount] = useState("");

    if (loading) {
        return <Loading />;
    }

    const walletInfo = {
        balance: "₹45,230.00",
        totalWithdrawn: "₹1,80,000.00",
        pendingSettlement: "₹12,500.00",
        bankName: "HDFC Bank Ltd.",
        accountNo: "******8291"
    };

    const handleWithdraw = (e) => {
        e.preventDefault();
        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        alert(`Withdrawal request of ₹${withdrawAmount} submitted successfully!`);
        setWithdrawAmount("");
    };

    return (
        <>
            <ControlPanel />
            <div className={styles.walletContainer}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>Organizer Wallet</h1>
                        <p>Track earnings, manage payouts, and request bank settlements.</p>
                    </div>
                </div>

                <div className={styles.walletGrid}>
                    {/* Balance Cards */}
                    <div className={styles.balanceCard}>
                        <div className={styles.cardHeader}>
                            <span>Available Balance</span>
                            <i className="fa-solid fa-wallet"></i>
                        </div>
                        <h2>{walletInfo.balance}</h2>
                        <small>Directly withdrawable to registered bank account.</small>
                    </div>

                    <div className={styles.statsCard}>
                        <div className={styles.statsRow}>
                            <div className={styles.statsItem}>
                                <small>Total Withdrawn</small>
                                <h4>{walletInfo.totalWithdrawn}</h4>
                            </div>
                            <div className={styles.statsItem}>
                                <small>Pending Settlement</small>
                                <h4>{walletInfo.pendingSettlement}</h4>
                            </div>
                        </div>
                        <div className={styles.bankDetail}>
                            <i className="fa-solid fa-building-columns"></i>
                            <div>
                                <small>Linked Bank Account</small>
                                <p>{walletInfo.bankName} ({walletInfo.accountNo})</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdraw Form */}
                <div className={styles.withdrawCard}>
                    <h3>Withdraw Funds</h3>
                    <p>Enter the amount you wish to transfer to your linked bank account. Processing takes 24-48 hours.</p>
                    
                    <form className={styles.withdrawForm} onSubmit={handleWithdraw}>
                        <div className={styles.inputArea}>
                            <span className={styles.currencySymbol}>₹</span>
                            <input 
                                type="number" 
                                placeholder="Enter Amount (e.g. 5000)" 
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.btnWithdraw}>Withdraw to Bank</button>
                    </form>
                </div>
            </div>
        </>
    );
}
