import Canvas from "./Canvas";
import Chat from "./Chat";

function Gameroom() {
    return (
        <> 
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

export default Gameroom;