import "./App.css";
import Canvas from "./Components/Canvas";
import Chat from "./Components/Chat";

function App() {
  return (
    <>
      <div>
        <h1>Drawing game</h1>
      </div>
      <div>
        <h2>Guess what this is?</h2>
      </div>

      <div style={{ display: "flex" }}>
        <Canvas />
        <Chat />
      </div>
    </>
  );
}

export default App;
