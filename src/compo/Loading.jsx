import styles from "../css/loading.module.css"

export default function Loading(){

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.spinner}>
                    <div className={styles.ring}></div>
                    <div className={styles.ring}></div>
                    <div className={styles.ring}></div>
                    <div className={styles.core}></div>
                </div>
                <div className={styles.loadingAnimation}>
                    <div className={styles.messages}>
                        <p>Loading</p>
                    </div>
                    <div className={styles.shorInfo}>
                        <p>always wear headphones when playing game to detect foot steps of enemy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}