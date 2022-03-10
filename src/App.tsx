import LingoDialog from "./LingoDialog/LingoDialog";

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
  ],
  translation: "Картина Дали очень странная",
};

function App() {
  return <LingoDialog data={dialogData1} />;
}

export default App;