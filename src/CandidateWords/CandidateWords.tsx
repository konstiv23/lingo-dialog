import { Dispatch, useEffect, useRef, useState } from "react";
import { wordAnimationDurationS } from "../constants";
import { LingoPayload } from "../LingoDialog/LingoReducer";
import WordButton from "../WordButton/WordButton";

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
      coords.push(children[i].getBoundingClientRect());
    }
    props.dispatch({
      type: "candidates-coord",
      payload: { candidatesCoord: coords, wordIndex: 0 },
    });
  }, []);

  const [disabledArray, setDisabledArray] = useState(() =>
    props.candidateWords.map(() => false)
  );

  // disabledArray management
  useEffect(() => {
    const newDisabled = [];
    for (let i = 0; i < props.candidateWords.length; i++) {
      if (props.guessedWordsIds.indexOf(i) !== -1) {
        newDisabled.push(true);
        continue;
      }
      const recentyUngessed =
        new Date().getTime() - props.unguessedTimestamps[i]?.getTime() <
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
  }, [props.unguessedTimestamps, props.guessedWordsIds]);

  return (
    <section style={{ display: "flex" }} ref={candidatesRef}>
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
