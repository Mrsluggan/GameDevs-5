import { useEffect, useState } from "react";
import Chat from "./Chat";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import Canvas from "./Canvas";
interface gameroom {
  gameRoomName: any
}


function Gameroom() {
  const stompClient = useStompClient();
  const [gamerooms, setGamerooms] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [gameRoomID, setGameRoomID] = useState<string>("");

  useSubscription("/topic/updateUI/", (message: any) => {

  });




  const loadGameRooms = () => {


      fetch("http://localhost:8080/api/gameroom/")
        .then(res => res.json())
        .then(data => {
          setGamerooms(data);
        })
    
  }
  const checkPlayers = () => {
    fetch("http://localhost:8080/api/gameroom/checkplayer/" + localStorage.getItem("username"))
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Player not found");
        }
      })
      .then(data => {
        setGameRoomID(data.id);
        setIsJoined(true);
        joinGame(data.id);
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


  const joinGame = (gameRoomID: string) => {
    setIsJoined(true);
    setGameRoomID(gameRoomID)

    fetch("http://localhost:8080/api/gameroom/join/" + gameRoomID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username")
      }),



    })


  }

  const leaveGameRoom = () => {
    console.log(gameRoomID);

    fetch("http://localhost:8080/api/gameroom/leave/" + gameRoomID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username")
      }),
    })

    setIsJoined(false);
    loadGameRooms();
  }

  useEffect(() => {
    loadGameRooms();
    checkPlayers();
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
                    <div>
                      <button onClick={() => joinGame(gameroom.id)}>Join game</button>

                    </div>
                  </div>
                  <hr />

                </li>

              ))}
            </ul>
          </div>
        </div>
        :
        /* här är canvas */
        <div style={{ padding: "2%" }}>
          <div style={{ textAlign: "left" }}>
            <button onClick={leaveGameRoom}>Lämna spelrum</button>
          </div>
          <Canvas gameRoomID={gameRoomID} />
        </div>}

    </>
  );
}

export default Gameroom;