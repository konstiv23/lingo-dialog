import styles from "./SentenceToTranslate.module.css";
import soundIcon from "./soundIcon.svg";
import cartoonCharacter from "./superhero-g5bad58971_640.png";

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
    <div className={styles["sentence-and-cartoon"]}>
      <div className={styles["cartoon-wrapper"]}>
        <img
          src={cartoonCharacter}
          alt="Cartoon Character"
          className={styles["cartoon"]}
        />
      </div>
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
        <div className={styles["triangle-pointer"]} />
      </p>
    </div>
  );
}

export default SentenceToTranslate;
