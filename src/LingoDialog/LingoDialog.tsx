import {
  Dispatch,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import styles from "./LingoDialog.module.css";
import WordButton from "../WordButton/WordButton";
import SentenceToTranslate from "../SentenceToTranlate/SentenceToTranslate";
import WordButtonAnimation from "../WordButtonAnimation/WordButtonAnimation";
import { wordAnimationDurationS } from "../constants";

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
  unguessedTimestamps: { [wordIndex: string]: Date };
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
      const wordIndex = action.payload.wordIndex;
      const guessedWordsIds = state.guessedWordsIds.filter(
        (i) => i !== wordIndex
      );
      return {
        ...state,
        guessedWordsIds,
        lastUnguessed: {
          wordIndex,
          coordFrom: eventToDOMRect(action.payload.event),
        },
        lastGuessed: undefined,
        unguessedTimestamps: {
          ...state.unguessedTimestamps,
          [wordIndex]: new Date(),
        },
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
    unguessedTimestamps: {},
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
          key={"guessed" + state.lastGuessed?.wordIndex}
        />
        <WordButtonAnimation
          word={state.candidateWords[state?.lastUnguessed?.wordIndex || 0]}
          from={state.lastUnguessed?.coordFrom}
          to={state.candidatesCoord?.[state?.lastUnguessed?.wordIndex || 0]}
          key={"unguessed" + state.lastUnguessed?.wordIndex}
        />
      </div>
    </main>
  );
}

type WordsParameters = {
  candidateWords: string[];
  guessedWordsIds: number[];
  dispatch: Dispatch<{ type: string; payload: Payload }>;
  unguessedTimestamps: { [wordIndex: string]: Date };
};

function GuessedSentence({
  candidateWords,
  guessedWordsIds,
  dispatch,
}: WordsParameters) {
  const containerRef = useRef<HTMLButtonElement>(null);
  // Dispatching coordinates of latest guessed word
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
  unguessedTimestamps,
}: WordsParameters) {
  const candidatesRef = useRef<HTMLElement>(null);

  // dispatching coordinates of all candidate words
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

  const [disabledArray, setDisabledArray] = useState(() =>
    candidateWords.map(() => false)
  );
  // disabledArray management
  useEffect(() => {
    const newDisabled = [];
    for (let i = 0; i < candidateWords.length; i++) {
      if (guessedWordsIds.indexOf(i) !== -1) {
        newDisabled.push(true);
        continue;
      }
      const recentyUngessed =
        new Date().getTime() - unguessedTimestamps[i]?.getTime() <
        wordAnimationDurationS * 1000;
      newDisabled.push(recentyUngessed);
      if (recentyUngessed) {
        setTimeout(() => {
          let modDisabled = [...disabledArray];
          modDisabled[i] = false;
          setDisabledArray(modDisabled);
        }, wordAnimationDurationS * 1000);
      }
    }
    setDisabledArray(newDisabled);
  }, [unguessedTimestamps, guessedWordsIds]);

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
          disabled={disabledArray[wordIndex]}
        />
      ))}
    </section>
  );
}

export default LingoDialog;
