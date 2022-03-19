import LingoDialog from "./LingoDialog/LingoDialog";
import styles from "./App.module.css";

const dialogData1 = {
  sentenceToTranslate: "The painting by Daly is really strange.",
  candidateWords: [
    "Картина",
    "любимый",
    "Ох",
    "выглядит",
    "очень",
    "музыка",
    "странная",
    "Дали",
  ],
  translation: "Картина Дали очень странная",
};

function App() {
  return (
    <main className={styles["app"]}>
      <LingoDialog {...dialogData1} />
    </main>
  );
}

export default App;
