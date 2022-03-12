import styles from "./SentenceToTranslate.module.css";
import soundIcon from "./soundIcon.svg";

function readAloud(sentenceToTranslate: string) {
  // Takes 15 seconds to speak for the first time after a page
  // load on 2 out 3 android devices. Guess shouldn't be using this at all.
  if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
    const utterance = new SpeechSynthesisUtterance(sentenceToTranslate);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }
}

function SentenceToTranslate({ sentence }: { sentence: string }) {
  return (
    <p className={styles["sentence-to-translate"]}>
      <button
        className={styles["read-aloud-button"]}
        onClick={() => readAloud(sentence)}
      >
        <img
          className={styles["read-aloud-icon"]}
          src={soundIcon}
          alt="Read aloud button"
        />{" "}
      </button>
      {sentence}
    </p>
  );
}

export default SentenceToTranslate;
