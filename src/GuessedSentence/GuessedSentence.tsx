import { Dispatch, useEffect, useRef } from "react";
import { LingoPayload } from "../LingoDialog/LingoReducer";
import WordButton from "../WordButton/WordButton";
import styles from "./GuessedSentence.module.css";

export default function GuessedSentence(props: {
  candidateWords: string[];
  guessedWordsIds: number[];
  dispatch: Dispatch<{ type: string; payload: LingoPayload }>;
}) {
  const containerRef = useRef<HTMLButtonElement>(null);
  // Dispatching coordinates of latest guessed word
  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }
    const lastButton = containerRef.current.lastChild as HTMLElement;
    if (!lastButton) return;
    props.dispatch({
      type: "last-guessed-word-coord",
      payload: {
        coordTo: lastButton.getBoundingClientRect(),
        wordIndex: props.guessedWordsIds[props.guessedWordsIds.length - 1],
      },
    });
  }, [props.guessedWordsIds]);

  return (
    <div className={styles["guessed-sentence-container"]}>
      <section ref={containerRef} className={styles["guessed-sentence"]}>
        {props.guessedWordsIds.map((wordIndex) => (
          <div className={styles["guessed-word-wrapper"]} key={wordIndex}>
            <WordButton
              text={props.candidateWords[wordIndex]}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                props.dispatch({
                  type: "unguessed",
                  payload: { wordIndex, event },
                });
              }}
            />
          </div>
        ))}
      </section>
      <div className={styles["horizontal-dividers"]}>
        <hr />
        <hr />
        <hr />
        <hr />
      </div>
    </div>
  );
}
