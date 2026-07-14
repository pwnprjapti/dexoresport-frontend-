import styles from "../css/loading.module.css"

export default function Loading(){

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.loadingAnimation}>
                    <div className={styles.messages}>
                        <p>fetching your profile </p>
                    </div>
                    <div className={styles.shorInfo}>
                        <p>always wear headphones when playing game to detect foot steps of enemy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}