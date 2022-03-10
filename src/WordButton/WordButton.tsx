import styles from "./WordButton.module.css";

export default function WordButton({
  text,
  onClick = () => {},
  disabled = false,
}: {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className={styles["lingo-button"]}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
