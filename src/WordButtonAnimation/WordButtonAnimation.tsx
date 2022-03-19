import { useEffect, useState } from "react";
import { wordAnimationDurationS } from "../constants";
import WordButton from "../WordButton/WordButton";

function wordStyle(from: DOMRect, to: DOMRect, animationPhase: number) {
  return {
    position: "absolute" as const,
    visibility:
      animationPhase === 0 ? ("visible" as const) : ("hidden" as const),
    left: animationPhase === 0 ? from.left : to.left,
    top: animationPhase === 0 ? from.top : to.top,
    transition:
      animationPhase === 0 ? "all 0s" : `all ${wordAnimationDurationS}s`,
  };
}

function WordButtonAnimation({
  word,
  from,
  to,
}: {
  word?: string;
  from?: DOMRect;
  to?: DOMRect;
}) {
  const [animationPhase, setAnimationPhase] = useState(0);
  useEffect(() => {
    setAnimationPhase(0);
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setAnimationPhase(1))
    );
  }, [word]);
  if (!word || !from || !to) {
    return null;
  }
  return (
    <div style={wordStyle(from, to, animationPhase)}>
      <WordButton text={word} />
    </div>
  );
}

export default WordButtonAnimation;
