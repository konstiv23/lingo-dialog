import { Dispatch, useEffect, useReducer, useRef } from "react";
import styles from "./LingoDialog.module.css";
import WordButton from "../WordButton/WordButton";
import SentenceToTranslate from "../SentenceToTranlate/SentenceToTranslate";
import WordButtonAnimation from "../WordButtonAnimation/WordButtonAnimation";

export type DialogProps = {
  sentenceToTranslate: string;
  candidateWords: string[];
  translation: string;
};

type DialogState = DialogProps & {
  guessedWordsIds: number[];
  lastGuessed?: { wordIndex: number; coordFrom: DOMRect; coordTo?: DOMRect };
  lastUnguessed?: { wordIndex: number; coordFrom: DOMRect };
  candidatesCoord?: DOMRect[];
};

type Payload = {
  wordIndex: number;
  event?: React.MouseEvent<HTMLButtonElement>;
  coordTo?: DOMRect;
  candidatesCoord?: DOMRect[];
};

function eventToDOMRect(event?: React.MouseEvent<HTMLButtonElement>) {
  if (!event) return { left: 0, top: 0 } as DOMRect;
  return (event.target as HTMLElement).getBoundingClientRect();
}

// I know, this is very ugly. Will use Redux Toolkit next time.
function reducer(
  state: DialogState,
  action: {
    type: string;
    payload: Payload;
  }
): DialogState {
  switch (action.type) {
    case "unguessed": {
      const guessedWordsIds = state.guessedWordsIds.filter(
        (i) => i !== action.payload.wordIndex
      );
      return {
        ...state,
        guessedWordsIds,
        lastUnguessed: {
          wordIndex: action.payload.wordIndex,
          coordFrom: eventToDOMRect(action.payload.event),
        },
        lastGuessed: undefined,
      };
    }
    case "guessed": {
      const guessedWordsIds = [...state.guessedWordsIds];
      const wordIndex = action.payload.wordIndex;
      if (guessedWordsIds.indexOf(wordIndex) !== -1) {
        return state;
      }
      guessedWordsIds.push(wordIndex);
      return {
        ...state,
        guessedWordsIds,
        lastGuessed: {
          wordIndex: action.payload.wordIndex,
          coordFrom: eventToDOMRect(action.payload.event),
        },
        lastUnguessed: undefined,
      };
    }
    case "last-guessed-word-coord": {
      if (!state.lastGuessed) {
        return state;
      }
      return {
        ...state,
        lastGuessed: { ...state.lastGuessed, coordTo: action.payload.coordTo },
      };
    }
    case "candidates-coord": {
      return { ...state, candidatesCoord: action.payload.candidatesCoord };
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
        <WordButtonAnimation
          word={state.candidateWords[state?.lastGuessed?.wordIndex || 0]}
          from={state.lastGuessed?.coordFrom}
          to={state.lastGuessed?.coordTo}
          key={state.lastGuessed?.wordIndex}
        />
        <WordButtonAnimation
          word={state.candidateWords[state?.lastUnguessed?.wordIndex || 0]}
          from={state.lastUnguessed?.coordFrom}
          to={state.candidatesCoord?.[state?.lastUnguessed?.wordIndex || 0]}
          key={(state.lastGuessed?.wordIndex || 999) + 100}
        />
      </div>
    </main>
  );
}

type WordsParameters = {
  candidateWords: string[];
  guessedWordsIds: number[];
  dispatch: Dispatch<{ type: string; payload: Payload }>;
};

function GuessedSentence({
  candidateWords,
  guessedWordsIds,
  dispatch,
}: WordsParameters) {
  const containerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }
    const lastButton = containerRef.current.lastChild as HTMLElement;
    if (!lastButton) return;
    dispatch({
      type: "last-guessed-word-coord",
      payload: {
        coordTo: lastButton.getBoundingClientRect(),
        wordIndex: guessedWordsIds[guessedWordsIds.length - 1],
      },
    });
  }, [guessedWordsIds]);

  return (
    <section ref={containerRef} style={{ display: "flex" }}>
      {guessedWordsIds.map((wordIndex) => (
        <div className={styles["guessed-word-wrapper"]} key={wordIndex}>
          <WordButton
            text={candidateWords[wordIndex]}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              dispatch({ type: "unguessed", payload: { wordIndex, event } });
            }}
          />
        </div>
      ))}
    </section>
  );
}

function Candidates({
  candidateWords,
  guessedWordsIds,
  dispatch,
}: WordsParameters) {
  const candidatesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!candidatesRef || !candidatesRef.current) {
      return;
    }
    const children = candidatesRef.current.children;
    const coords = [];
    for (let i = 0; i < children.length; i++) {
      coords.push(children[i].getBoundingClientRect());
    }
    dispatch({
      type: "candidates-coord",
      payload: { candidatesCoord: coords, wordIndex: 0 },
    });
  }, []);

  return (
    <section style={{ display: "flex" }} ref={candidatesRef}>
      {candidateWords.map((word, wordIndex) => (
        <WordButton
          text={word}
          key={wordIndex}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            dispatch({
              type: "guessed",
              payload: { wordIndex, event },
            });
          }}
          disabled={guessedWordsIds.indexOf(wordIndex) !== -1}
        />
      ))}
    </section>
  );
}

export default LingoDialog;
