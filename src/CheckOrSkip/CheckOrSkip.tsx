import styles from "./CheckOrSkip.module.css";

export default function CheckOrSkip(props: { haveAGuess: boolean }) {
  return (
    <div className={styles["check-or-skip"]}>
      <hr className={styles["hr"]} />
      <div className={styles.buttons}>
        <button className={styles["cos-button"]}>ПРОПУСТИТЬ</button>
        <button
          className={`${styles["cos-button"]} ${styles["check"]}`}
          disabled={!props.haveAGuess}
        >
          ПРОВЕРИТЬ
        </button>
      </div>
    </div>
  );
}
