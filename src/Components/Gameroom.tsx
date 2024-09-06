import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import Chat from "./Chat";
import { useStompClient, useSubscription } from "react-stomp-hooks";
interface gameroom {
  gameRoomName: any
}


function Gameroom() {
  const stompClient = useStompClient();
  const [gamerooms, setGamerooms] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [gameRoomID, setGameRoomID] = useState<string>("");





  const loadGameRooms = () => {
    fetch("http://localhost:8080/api/gameroom/")
      .then(res => res.json())
      .then(data => {
        setGamerooms(data);
        console.log(data);
      })
  }

  const createGame = () => {
    console.log("hej!");

    let gameroomName = prompt("Enter gameroom name");
    fetch("http://localhost:8080/api/gameroom/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameRoomName: gameroomName,
        roomOwner: localStorage.getItem("username")
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        loadGameRooms();
      })
  }


  const joinGame = (gameRoomID:string) => {
    console.log(">:D");
    setIsJoined(true);
    setGameRoomID(gameRoomID)
    console.log(gameRoomID);
    


  }

  useEffect(() => {
    loadGameRooms();
  }, [])

  return (
    <>
      {/* kollar om personen tillhög en grupp, visar antigen gameroom div eller canvas */}
      {!isJoined ?
        <div id="GameRoomDiv">
          <div>
            <h2>Guess what this is?</h2>
          </div>
          create new game: <button onClick={createGame}>Create new game room</button>
          <div style={{ textAlign: "left" }}>
            <ul style={{ listStyle: "none" }}>
              {gamerooms.map((gameroom) => (
                <li key={gameroom.id} style={{}}>
                  <div id="container" style={{ margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3>{gameroom.gameRoomName}</h3>
                      <p>Room owner: <strong>{gameroom.roomOwner}</strong></p>
                      current players: {gameroom.listOfPlayers.length}

                    </div>
                    <button onClick={() => joinGame(gameroom.id)}>Join game</button>
                  </div>
                  <hr />

                </li>

              ))}
            </ul>
          </div>
        </div>
        :
        /* här är canvas */
        <div>

          <Chat gameRoomID={gameRoomID} />

        </div>}

    </>
  );
}

export default Gameroom;