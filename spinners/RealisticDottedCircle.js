import styles from "./RealisticDottedCircle.module.css";

function RealisticDottedCircle({size,color}) {
  return (
    <div className={styles["sk-chase"]} style={{
        width: size?`${size*4}px`:'40px',
        height: size?`${size*4}px`:'40px',
    }}>
        <div className={styles["sk-chase-dot"]} style={{
            width: size?`${size*4}px`:'40px',
            height: size?`${size*4}px`:'40px',
        }}>
        <div className={styles["sk-chase-dot-before"]} style={{
            backgroundColor: color?color:'rgb(54, 215, 183)'
        }} />
        </div>
        <div className={styles["sk-chase-dot"]} style={{
            width: size?`${size*4}px`:'40px',
            height: size?`${size*4}px`:'40px',
        }}>
        <div className={styles["sk-chase-dot-before"]} style={{
            backgroundColor: color?color:'rgb(54, 215, 183)'
        }} />
        </div>
        <div className={styles["sk-chase-dot"]} style={{
            width: size?`${size*4}px`:'40px',
            height: size?`${size*4}px`:'40px',
        }}>
        <div className={styles["sk-chase-dot-before"]} style={{
            backgroundColor: color?color:'rgb(54, 215, 183)'
        }} />
        </div>
        <div className={styles["sk-chase-dot"]} style={{
            width: size?`${size*4}px`:'40px',
            height: size?`${size*4}px`:'40px',
        }}>
        <div className={styles["sk-chase-dot-before"]} style={{
            backgroundColor: color?color:'rgb(54, 215, 183)'
        }} />
        </div>
        <div className={styles["sk-chase-dot"]} style={{
            width: size?`${size*4}px`:'40px',
            height: size?`${size*4}px`:'40px',
        }}>
        <div className={styles["sk-chase-dot-before"]} style={{
            backgroundColor: color?color:'rgb(54, 215, 183)'
        }} />
        </div>
        <div className={styles["sk-chase-dot"]} style={{
            width: size?`${size*4}px`:'40px',
            height: size?`${size*4}px`:'40px',
        }}>
        <div className={styles["sk-chase-dot-before"]} style={{
            backgroundColor: color?color:'rgb(54, 215, 183)'
        }} />
        </div>
    </div>
  )
}

export default RealisticDottedCircle