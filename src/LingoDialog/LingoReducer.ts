import boundingRectRelativeToDoc from "../utils/boundingRectRelativeToDoc";
import { DialogState } from "./LingoDialog";

function eventToDOMRect(event?: React.MouseEvent<HTMLButtonElement>) {
  if (!event) return { left: 0, top: 0 } as DOMRect;
  return boundingRectRelativeToDoc(
    (event.target as HTMLElement).getBoundingClientRect()
  );
}

export type LingoPayload = {
  wordIndex: number;
  event?: React.MouseEvent<HTMLButtonElement>;
  coordTo?: DOMRect;
  candidatesCoord?: DOMRect[];
};

// I will use Redux Toolkit next time.
export default function lingoReducer(
  state: DialogState,
  action: {
    type: string;
    payload: LingoPayload;
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
