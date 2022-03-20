import { useReducer } from "react";
import styles from "./LingoDialog.module.css";
import SentenceToTranslate from "../SentenceToTranlate/SentenceToTranslate";
import WordButtonAnimation from "../WordButtonAnimation/WordButtonAnimation";
import lingoReducer from "./LingoReducer";
import GuessedSentence from "../GuessedSentence/GuessedSentence";
import CandidateWords from "../CandidateWords/CandidateWords";

export type DialogProps = {
  sentenceToTranslate: string;
  candidateWords: string[];
  translation: string;
};

export type DialogState = DialogProps & {
  guessedWordsIds: number[];
  lastGuessed?: { wordIndex: number; coordFrom: DOMRect; coordTo?: DOMRect };
  lastUnguessed?: { wordIndex: number; coordFrom: DOMRect };
  candidatesCoord?: DOMRect[];
  unguessedTimestamps: { [wordIndex: string]: Date };
};

export default function LingoDialog(props: DialogProps) {
  const [state, dispatch] = useReducer(lingoReducer, {
    ...props,
    guessedWordsIds: [1, 3],
    unguessedTimestamps: {},
  });
  return (
    <div className={styles.app}>
      <div className={styles["guessing-container"]}>
        <h1 className={styles["enter-translation"]}>
          Введите перевод на русский
        </h1>
        <SentenceToTranslate sentence={state.sentenceToTranslate} />
        <GuessedSentence {...state} dispatch={dispatch} />
        <CandidateWords {...state} dispatch={dispatch} />

        <WordButtonAnimation
          word={state.candidateWords[state?.lastGuessed?.wordIndex || 0]}
          from={state.lastGuessed?.coordFrom}
          to={state.lastGuessed?.coordTo}
          key={"guessed" + state.lastGuessed?.wordIndex}
        />
        <WordButtonAnimation
          word={state.candidateWords[state?.lastUnguessed?.wordIndex || 0]}
          from={state.lastUnguessed?.coordFrom}
          to={state.candidatesCoord?.[state?.lastUnguessed?.wordIndex || 0]}
          key={"unguessed" + state.lastUnguessed?.wordIndex}
        />
      </div>
    </div>
  );
}
