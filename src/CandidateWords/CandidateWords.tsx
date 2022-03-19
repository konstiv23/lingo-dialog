import { Dispatch, useCallback, useEffect, useReducer, useRef } from "react";
import { wordAnimationDurationS } from "../constants";
import { LingoPayload } from "../LingoDialog/LingoReducer";
import boundingRectRelativeToDoc from "../utils/boundingRectRelativeToDoc";
import WordButton from "../WordButton/WordButton";
import styles from "./CandidateWords.module.css";

function disabledReducer(
  state: boolean[],
  action: { type: string; payload: { wordIndex: number; isDisabled: boolean } }
) {
  switch (action.type) {
    case "set-at-index": {
      const newState = [...state];
      newState[action.payload.wordIndex] = action.payload.isDisabled;
      return newState;
    }
    default:
      throw new Error("unknown action type");
  }
}

export default function CandidateWords(props: {
  candidateWords: string[];
  guessedWordsIds: number[];
  dispatch: Dispatch<{ type: string; payload: LingoPayload }>;
  unguessedTimestamps: { [wordIndex: string]: Date };
}) {
  const candidatesRef = useRef<HTMLElement>(null);

  // dispatching coordinates of all candidate words
  useEffect(() => {
    if (!candidatesRef || !candidatesRef.current) {
      return;
    }
    const children = candidatesRef.current.children;
    const coords = [];
    for (let i = 0; i < children.length; i++) {
      coords.push(
        boundingRectRelativeToDoc(children[i].getBoundingClientRect())
      );
    }
    props.dispatch({
      type: "candidates-coord",
      payload: { candidatesCoord: coords, wordIndex: 0 },
    });
  }, [document.body.clientWidth, document.body.clientHeight]);

  // disabledArray management
  const [disabledArray, dispatch] = useReducer(
    disabledReducer,
    props.candidateWords.map(() => false)
  );

  const setDisabled = useCallback((wordIndex: number, isDisabled: boolean) => {
    dispatch({
      type: "set-at-index",
      payload: { wordIndex, isDisabled },
    });
  }, []);

  useEffect(() => {
    for (let i = 0; i < props.candidateWords.length; i++) {
      if (props.guessedWordsIds.indexOf(i) !== -1) {
        setDisabled(i, true);
        continue;
      }
      const recentyUngessed =
        new Date().getTime() - props.unguessedTimestamps[i]?.getTime() <
        wordAnimationDurationS * 1000;
      setDisabled(i, recentyUngessed);
      if (recentyUngessed) {
        setTimeout(() => {
          setDisabled(i, false);
        }, wordAnimationDurationS * 1000);
      }
    }
  }, [props.unguessedTimestamps, props.guessedWordsIds]);

  return (
    <section className={styles["candidate-words"]} ref={candidatesRef}>
      {props.candidateWords.map((word, wordIndex) => (
        <WordButton
          text={word}
          key={wordIndex}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            props.dispatch({
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
