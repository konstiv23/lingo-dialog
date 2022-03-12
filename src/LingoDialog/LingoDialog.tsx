import { useState } from "react";
import styles from "./LingoDialog.module.css";
import WordButton from "../WordButton/WordButton";
import SentenceToTranslate from "../SentenceToTranlate/SentenceToTranslate";

export type DialogData = {
  sentenceToTranslate: string;
  candidateWords: string[];
  translation: string;
};

function LingoDialog({ data }: { data: DialogData }) {
  const { sentenceToTranslate, candidateWords, translation } = data;
  const [guessedWordsIds, setGuessedWordsIds] = useState([1, 3]);
  return (
    <main className={styles.app}>
      <div className={styles["guessing-container"]}>
        <h1>Введите перевод на русский</h1>
        <SentenceToTranslate sentence={sentenceToTranslate} />
        <GuessedSentence
          candidateWords={candidateWords}
          guessedWordsIds={guessedWordsIds}
          setGuessedWordsIds={setGuessedWordsIds}
        />
        <Candidates
          candidateWords={candidateWords}
          guessedWordsIds={guessedWordsIds}
          setGuessedWordsIds={setGuessedWordsIds}
        />
      </div>
    </main>
  );
}

type WordsParameters = {
  candidateWords: string[];
  guessedWordsIds: number[];
  setGuessedWordsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

function GuessedSentence({
  candidateWords,
  guessedWordsIds,
  setGuessedWordsIds,
}: WordsParameters) {
  return (
    <section>
      {guessedWordsIds.map((wordIndex) => (
        <WordButton
          text={candidateWords[wordIndex]}
          key={wordIndex}
          onClick={() => {
            setGuessedWordsIds(guessedWordsIds.filter((i) => i !== wordIndex));
          }}
        />
      ))}
    </section>
  );
}

function Candidates({
  candidateWords,
  guessedWordsIds,
  setGuessedWordsIds,
}: WordsParameters) {
  return (
    <section>
      {candidateWords.map((word, index) => (
        <WordButton
          text={word}
          key={index}
          onClick={() => {
            const newGuessedWordIds = [...guessedWordsIds];
            if (newGuessedWordIds.indexOf(index) !== -1) {
              return;
            }
            newGuessedWordIds.push(index);
            setGuessedWordsIds(newGuessedWordIds);
          }}
          disabled={guessedWordsIds.indexOf(index) !== -1}
        />
      ))}
    </section>
  );
}

export default LingoDialog;
