import styles from "../css/toaster.module.css"

export default function Toaster({tmsg, color, bg, border, visible}){

    return (
        <>
        <div  style={{
          color,
          backgroundColor: bg,
          border: `1px solid ${border}`,
          display:visible
        }} className={styles.toaster}>
            <p>
        {tmsg}
      </p>
        </div>
        </>
    )
}