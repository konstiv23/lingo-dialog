import { Dispatch, useReducer, useState } from "react";
import styles from "./LingoDialog.module.css";
import WordButton from "../WordButton/WordButton";
import SentenceToTranslate from "../SentenceToTranlate/SentenceToTranslate";

export type DialogProps = {
  sentenceToTranslate: string;
  candidateWords: string[];
  translation: string;
};

type DialogState = DialogProps & {
  guessedWordsIds: number[];
};

function reducer(
  state: DialogState,
  action: { type: string; payload: number }
) {
  switch (action.type) {
    case "unguessed": {
      const guessedWordsIds = state.guessedWordsIds.filter(
        (i) => i !== action.payload
      );
      return { ...state, guessedWordsIds };
    }
    case "guessed": {
      const guessedWordsIds = [...state.guessedWordsIds];
      const wordIndex = action.payload;
      if (guessedWordsIds.indexOf(wordIndex) !== -1) {
        return state;
      }
      guessedWordsIds.push(wordIndex);
      return { ...state, guessedWordsIds };
    }
    default:
      throw new Error("unknown action type");
  }
}

function LingoDialog(props: DialogProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...props,
    guessedWordsIds: [1, 3],
  });
  return (
    <main className={styles.app}>
      <div className={styles["guessing-container"]}>
        <h1>Введите перевод на русский</h1>
        <SentenceToTranslate sentence={state.sentenceToTranslate} />
        <GuessedSentence {...state} dispatch={dispatch} />
        <Candidates {...state} dispatch={dispatch} />
      </div>
    </main>
  );
}

type WordsParameters = {
  candidateWords: string[];
  guessedWordsIds: number[];
  dispatch: Dispatch<{ type: string; payload: number }>;
};

function GuessedSentence({
  candidateWords,
  guessedWordsIds,
  dispatch,
}: WordsParameters) {
  return (
    <section>
      {guessedWordsIds.map((wordIndex) => (
        <WordButton
          text={candidateWords[wordIndex]}
          key={wordIndex}
          onClick={() => {
            dispatch({ type: "unguessed", payload: wordIndex });
          }}
        />
      ))}
    </section>
  );
}

function Candidates({
  candidateWords,
  guessedWordsIds,
  dispatch,
}: WordsParameters) {
  return (
    <section>
      {candidateWords.map((word, wordIndex) => (
        <WordButton
          text={word}
          key={wordIndex}
          onClick={() => {
            dispatch({ type: "guessed", payload: wordIndex });
          }}
          disabled={guessedWordsIds.indexOf(wordIndex) !== -1}
        />
      ))}
    </section>
  );
}

export default LingoDialog;
