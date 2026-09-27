import styles from "../css/loading.module.css";

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinnerWrapper}>
                <div className={styles.doublePulse}>
                    <div className={styles.pulse1}></div>
                    <div className={styles.pulse2}></div>
                </div>
                <div className={styles.spinnerRing}></div>
                <span className={styles.brandText}>DEXOR</span>
            </div>
            <p className={styles.loadingText}>Loading battle arena stats...</p>
        </div>
    );
}
