import styles from "./WordButton.module.css";

export default function WordButton({
  text,
  onClick = () => {},
  disabled = false,
}: {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) {
  // Without div wrapper animation doesn't work correctly on Windows.
  return (
    <div>
      <button
        className={styles["word-button"]}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
}
