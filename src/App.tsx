import styles from "./App.module.css";
import soundIcon from "./soundIcon.svg";

const sentenceToTranslate = "The painting by Daly is really strange.";
const candidateWords = [
  "Картина",
  "любимый",
  "Ох",
  "выглядит",
  "очень",
  "музыка",
  "странная",
];
const translation = "Картина Дали очень странная";
const guessedWordsIds = [1, 3];

function readAloud() {
  if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
    const utterance = new SpeechSynthesisUtterance(sentenceToTranslate);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }
}

function App() {
  return (
    <main className={styles.app}>
      <div className={styles["guessing-container"]}>
        <h1>Введите перевод на русский</h1>

        <p className={styles["sentence-to-translate"]}>
          <button className={styles["read-aloud-button"]} onClick={readAloud}>
            <img
              className={styles["read-aloud-icon"]}
              src={soundIcon}
              alt="Read aloud button"
            />{" "}
          </button>
          {sentenceToTranslate}
        </p>
        <GuessedSentence />
      </div>
    </main>
  );
}

function GuessedSentence() {
  return (
    <section>
      {guessedWordsIds.map((wordId) => (
        <span>{wordId}</span>
      ))}
    </section>
  );
}

export default App;
