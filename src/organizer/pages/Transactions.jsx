import ControlPanel from "../compo/controlPanel";
import OrganizerPaymentGateway from "../compo/OrganizerPaymentGateway";
import styles from "../css/transactions.module.css";

export default function Transactions() {
    return (
        <>
            <ControlPanel />
            <div className={styles.transactionsContainer}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>Transaction Logs & Gateway</h1>
                        <p>Real-time tournament entry transactions and payment.ubresports.in gateway status.</p>
                    </div>
                </div>

                <OrganizerPaymentGateway />
            </div>
        </>
    );
}
